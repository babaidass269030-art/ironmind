// Gym calculators - Plate, BMI, TDEE/Calories, 1RM Percentages, Warm-up Sets

export interface PlateResult {
  weightPerSide: number;
  platesPerSide: { weight: number; count: number }[];
  exactMatch: boolean;
  remainder: number;
}

export const PlateCalculator = {
  calculatePlates(
    targetWeight: number,
    barWeight: number,
    availablePlates: number[] = [25, 20, 15, 10, 5, 2.5, 1.25]
  ): PlateResult {
    if (targetWeight <= barWeight) {
      return {
        weightPerSide: 0,
        platesPerSide: [],
        exactMatch: targetWeight === barWeight,
        remainder: 0
      };
    }

    const totalToLoad = targetWeight - barWeight;
    let targetPerSide = totalToLoad / 2;
    const sortedPlates = [...availablePlates].sort((a, b) => b - a);

    const platesPerSide: { weight: number; count: number }[] = [];
    let currentSideWeight = 0;

    for (const plate of sortedPlates) {
      let count = 0;
      while (targetPerSide >= plate - 0.001) {
        count++;
        targetPerSide -= plate;
        currentSideWeight += plate;
      }
      if (count > 0) {
        platesPerSide.push({ weight: plate, count });
      }
    }

    const remainder = Math.round(targetPerSide * 2 * 100) / 100;
    return {
      weightPerSide: Math.round(currentSideWeight * 100) / 100,
      platesPerSide,
      exactMatch: Math.abs(remainder) < 0.01,
      remainder
    };
  }
};

export interface BMICalculatorResult {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese';
  categoryColor: string;
  healthyRangeText: string;
}

export const BMICalculator = {
  calculate(heightCm: number, weightKg: number): BMICalculatorResult {
    if (heightCm <= 0 || weightKg <= 0) {
      return {
        bmi: 0,
        category: 'Normal weight',
        categoryColor: 'text-emerald-400',
        healthyRangeText: 'N/A'
      };
    }
    const heightM = heightCm / 100;
    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

    let category: BMICalculatorResult['category'] = 'Normal weight';
    let categoryColor = 'text-emerald-400';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-amber-400';
    } else if (bmi < 25) {
      category = 'Normal weight';
      categoryColor = 'text-emerald-400';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-amber-400';
    } else {
      category = 'Obese';
      categoryColor = 'text-rose-400';
    }

    const minHealthyKg = Math.round(18.5 * heightM * heightM * 10) / 10;
    const maxHealthyKg = Math.round(24.9 * heightM * heightM * 10) / 10;

    return {
      bmi,
      category,
      categoryColor,
      healthyRangeText: `${minHealthyKg} - ${maxHealthyKg} kg`
    };
  }
};

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export interface CalorieResult {
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  surplusCalories: number;
  deficitCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const CalorieEstimator = {
  estimate(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: 'male' | 'female',
    activityLevel: ActivityLevel,
    goal: 'gain' | 'lose' | 'maintain' = 'maintain'
  ): CalorieResult {
    // Mifflin-St Jeor formula
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const multiplier = multipliers[activityLevel] || 1.55;
    const tdee = Math.round(bmr * multiplier);
    const maintenanceCalories = tdee;
    const surplusCalories = Math.round(tdee + 350);
    const deficitCalories = Math.round(tdee - 450);

    let targetCalories = maintenanceCalories;
    if (goal === 'gain') targetCalories = surplusCalories;
    if (goal === 'lose') targetCalories = deficitCalories;

    // Standard sports nutrition macro breakdown: 2g protein per kg, 25% fats, remaining carbs
    const proteinGrams = Math.round(weightKg * 2.0);
    const proteinCals = proteinGrams * 4;
    const fatCals = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCals / 9);
    const carbsCals = Math.max(0, targetCalories - (proteinCals + fatCals));
    const carbsGrams = Math.round(carbsCals / 4);

    return {
      bmr,
      tdee,
      maintenanceCalories,
      surplusCalories,
      deficitCalories,
      proteinGrams,
      carbsGrams,
      fatGrams
    };
  }
};

export interface WarmupSetGuide {
  percentage: number;
  weight: number;
  reps: string;
  purpose: string;
}

export const WarmupCalculator = {
  generateWarmup(workWeightKg: number, barWeight = 20): WarmupSetGuide[] {
    if (workWeightKg <= barWeight) {
      return [
        { percentage: 100, weight: barWeight, reps: '8-10', purpose: 'Joint lubrication & bar groove' }
      ];
    }

    return [
      {
        percentage: 0,
        weight: barWeight,
        reps: '10',
        purpose: 'Barbell groove, shoulder & hip mobility'
      },
      {
        percentage: 50,
        weight: Math.round((workWeightKg * 0.5) / 2.5) * 2.5,
        reps: '5',
        purpose: 'Potentiation & nervous system activation'
      },
      {
        percentage: 70,
        weight: Math.round((workWeightKg * 0.7) / 2.5) * 2.5,
        reps: '3',
        purpose: 'Movement velocity & groove reinforcement'
      },
      {
        percentage: 85,
        weight: Math.round((workWeightKg * 0.85) / 2.5) * 2.5,
        reps: '1-2',
        purpose: 'Final acclimatization without accumulating fatigue'
      }
    ];
  }
};
