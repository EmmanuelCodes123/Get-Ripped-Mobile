import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import {
  configureAudioMode,
  playWorkoutSound,
} from "@/src/lib/helper-functions/sound-helper";
import { WorkoutPlayerScreen } from "../../screens/WorkoutPlayerScreen";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import { Exercise, Workout } from "../../types/workout";

export default function ActiveWorkoutRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getWorkoutById } = useWorkoutStore();

  const workout = useMemo<Workout | undefined>(
    () => getWorkoutById(id || ""),
    [id],
  );

  // Player State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState<"GET READY" | "GO" | "REST">(
    "GET READY",
  );
  const [showRoundBreak, setShowRoundBreak] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [totalTimeForPhase, setTotalTimeForPhase] = useState(5);

  const currentExercise = useMemo<Exercise | undefined>(
    () => workout?.exercises[currentIndex],
    [workout, currentIndex],
  );

  // Audio Initialization
  useEffect(() => {
    configureAudioMode();
  }, []);

  // Timer and Sound Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const isRepsMode = currentExercise?.reps_mode;

    if (isActive) {
      // 1. Tick Sound (10 seconds left in GO phase)
      if (status === "GO" && !isRepsMode && timeLeft === 10) {
        playWorkoutSound("tick", isMuted);
      }

      // 2. Bell Sound (3, 2, 1, and 0)
      if (timeLeft <= 3 && timeLeft >= 1) {
        const isCountdownPhase = status !== "GO" || !isRepsMode;
        if (isCountdownPhase) {
          playWorkoutSound("bell", isMuted);
        }
      }
    }

    const shouldCountDown =
      isActive && timeLeft > 0 && (status !== "GO" || !isRepsMode);

    if (shouldCountDown) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive && (status !== "GO" || !isRepsMode)) {
      handlePhaseTransition();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft, isActive, status, currentExercise, isMuted]);

  const handlePhaseTransition = () => {
    if (status === "GET READY") startWorkPhase();
    else if (status === "GO") startRestPhase();
    else if (status === "REST") {
      if (currentSet < parseInt(currentExercise?.sets || "1")) {
        setCurrentSet((prev) => prev + 1);
        startWorkPhase();
      } else handleNextExercise();
    }
  };

  const startWorkPhase = () => {
    if (!currentExercise) return;
    setStatus("GO");
    const time = currentExercise.reps_mode ? 0 : parseInt(currentExercise.time);
    setTimeLeft(time);
    setTotalTimeForPhase(time || 1);

    playWorkoutSound("triple-bell", isMuted);
  };

  const startRestPhase = () => {
    if (!currentExercise) return;
    setStatus("REST");
    const time = parseInt(currentExercise.rest);
    setTimeLeft(time);
    setTotalTimeForPhase(time || 1);

    playWorkoutSound("triple-bell", isMuted);
  };

  const handleNextExercise = () => {
    if (!workout) return;
    if (currentIndex < workout.exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCurrentSet(1);
      setStatus("GO"); // Subsequent exercises skip initial "Get Ready"
    } else {
      const totalRounds = parseInt(workout.rounds || "1");
      if (currentRound < totalRounds) {
        triggerNextRound();
      } else {
        setIsActive(false);
        router.push({
          pathname: "/workout-summary",
          params: { workoutName: workout.name },
        });
      }
    }
  };

  const triggerNextRound = () => {
    setIsActive(false);
    setShowRoundBreak(true);
    setTimeout(() => {
      setCurrentRound((prev) => prev + 1);
      setCurrentIndex(0);
      setCurrentSet(1);
      setStatus("GET READY");
      setTimeLeft(5);
      setTotalTimeForPhase(5);
      setShowRoundBreak(false);
      setIsActive(true);
    }, 3500);
  };

  if (!workout || !currentExercise) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      />
      <WorkoutPlayerScreen
        workout={workout}
        currentExercise={currentExercise}
        currentSet={currentSet}
        currentRound={currentRound}
        status={status}
        displayValue={
          status === "GO" && currentExercise.reps_mode
            ? `x${currentExercise.reps}`
            : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`
        }
        percentageLeft={timeLeft / totalTimeForPhase}
        isActive={isActive}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        showRoundBreak={showRoundBreak}
        onBack={() => {
          setIsActive(false);
          router.back();
        }}
        onPause={() => setIsActive(!isActive)}
        onNext={handlePhaseTransition}
        onPrev={() => {}}
      />
    </>
  );
}
