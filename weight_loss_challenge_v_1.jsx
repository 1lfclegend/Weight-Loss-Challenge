import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, CloudSun, Home, Building2, Trophy, Flame, CheckCircle2, Scale } from "lucide-react";

const DAY_TYPES = [
  { value: "both_wfh", label: "Both WFH" },
  { value: "mixed", label: "One WFH / One Office" },
  { value: "both_office", label: "Both Office" },
  { value: "annual_leave", label: "Annual Leave / Day Off" },
  { value: "flexi_leave", label: "Flexi Leave" },
  { value: "weekend", label: "Weekend / Mostly Off" },
];

const WEATHER_TYPES = [
  { value: "good", label: "Good / Dry" },
  { value: "mixed", label: "Mixed" },
  { value: "bad", label: "Bad / Wet" },
];

const BASE_TASK_LIBRARY = [
  {
    id: "long_walk_off",
    title: "Long walk / active outing",
    category: "Activity",
    points: 3,
    people: ["Michael", "Sarah"],
    dayTypes: ["annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed"],
    description: "Best suited to days off and weekends when time is easier.",
  },
  {
    id: "family_activity",
    title: "Active family time",
    category: "Activity",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Movement built into time off instead of a fully sedentary day.",
  },
  {
    id: "food_control_off",
    title: "Stay in control on a day off",
    category: "Food",
    points: 3,
    people: ["Michael", "Sarah"],
    dayTypes: ["annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Avoid the usual day-off drift into overeating.",
  },
  {
    id: "prep_next_week",
    title: "Prep for next work day",
    category: "Commitment",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["weekend", "flexi_leave", "annual_leave"],
    weather: ["good", "mixed", "bad"],
    description: "Use time off to make the next workday easier.",
  },
  {
    id: "gym",
    title: "Gym session",
    category: "Activity",
    points: 5,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Main training session for the day.",
  },
  {
    id: "walk_30",
    title: "30-minute walk",
    category: "Activity",
    points: 3,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed"],
    description: "Good-weather movement option.",
  },
  {
    id: "indoor_steps",
    title: "Indoor steps / movement block",
    category: "Activity",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["bad", "mixed"],
    description: "Fallback movement option for poor weather.",
  },
  {
    id: "calorie_deficit",
    title: "Stay in calorie deficit",
    category: "Food",
    points: 3,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Core food-control target for the day.",
  },
  {
    id: "protein_goal",
    title: "Hit protein goal",
    category: "Food",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "High-protein meals/snacks.",
  },
  {
    id: "no_treats",
    title: "No random treats/snacking",
    category: "Discipline",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Avoid impulse eating.",
  },
  {
    id: "finish_work_on_time",
    title: "Finish work on time",
    category: "Commitment",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["mixed", "both_office", "both_wfh", "annual_leave", "flexi_leave"],
    weather: ["good", "mixed", "bad"],
    description: "Protect evening routine and reduce drift.",
  },
  {
    id: "meal_prep",
    title: "Prep meals / lunches",
    category: "Habit",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Set up the next day for success.",
  },
  {
    id: "water_goal",
    title: "Hit water goal",
    category: "Habit",
    points: 1,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Basic consistency target.",
  },
  {
    id: "dishwasher",
    title: "Empty/load dishwasher",
    category: "Discipline",
    points: 1,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Low-friction discipline win.",
  },
  {
    id: "washing",
    title: "Put on washing",
    category: "Discipline",
    points: 1,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Another easy win that supports routine.",
  },
  {
    id: "put_washing_away",
    title: "Put washing away",
    category: "Discipline",
    points: 1,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good", "mixed", "bad"],
    description: "Close the loop on chores.",
  },
  {
    id: "evening_walk",
    title: "Short evening walk together",
    category: "Activity",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["both_wfh", "mixed", "annual_leave", "flexi_leave", "weekend"],
    weather: ["good"],
    description: "Simple couple-friendly movement option.",
  },
  {
    id: "office_lunch_control",
    title: "Bring or stick to planned lunch",
    category: "Food",
    points: 3,
    people: ["Michael", "Sarah"],
    dayTypes: ["mixed", "both_office", "weekend", "annual_leave", "flexi_leave"],
    weather: ["good", "mixed", "bad"],
    description: "Strong office-day food control task.",
  },
  {
    id: "early_night",
    title: "Early night / no late drifting",
    category: "Commitment",
    points: 2,
    people: ["Michael", "Sarah"],
    dayTypes: ["mixed", "both_office", "weekend", "annual_leave", "flexi_leave"],
    weather: ["good", "mixed", "bad"],
    description: "Helps protect the next day.",
  },
];

const MONTHLY_WELLBEING_TASKS = [
  { id: "date_night", title: "Date night", points: 3, description: "Protected couple time without phones taking over." },
  { id: "child_free_time", title: "Child-free time", points: 3, description: "A proper break together or individually to recharge." },
  { id: "social_time", title: "Social time", points: 2, description: "Meet friends or family and stay connected." },
  { id: "movie_night", title: "Movie night at home", points: 1, description: "Low-cost switch-off time together." },
  { id: "coffee_walk", title: "Coffee + walk", points: 2, description: "Simple reset with movement built in." },
  { id: "no_chores_hour", title: "One no-chores hour", points: 1, description: "Deliberate downtime with zero household jobs." },
  { id: "meal_out_planned", title: "Planned meal out", points: 2, description: "Enjoyable meal without turning it into a free-for-all." },
  { id: "family_day_out", title: "Family day out", points: 2, description: "Positive memory-building time that breaks routine." },
];

const defaultWeek = {
  Michael: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
  Sarah: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
};

const defaultWeights = {
  Michael: { starting: "", current: "" },
  Sarah: { starting: "", current: "" },
};

const personColors = {
  Michael: "from-slate-900 to-slate-700",
  Sarah: "from-pink-600 to-rose-500",
};

function getTodayKey() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}

function getSuggestedTasks(taskLibrary, dayType, weather, person) {
  const filtered = taskLibrary.filter(
    (task) =>
      task.people.includes(person) &&
      task.dayTypes.includes(dayType) &&
      task.weather.includes(weather)
  );

  const orderedCategories = ["Activity", "Food", "Commitment", "Habit", "Discipline"];
  return filtered.sort((a, b) => {
    const categoryDiff = orderedCategories.indexOf(a.category) - orderedCategories.indexOf(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return b.points - a.points;
  });
}

export default function WeightLossChallengeApp() {
  const [dayType, setDayType] = useState("both_wfh");
  const [weather, setWeather] = useState("good");
  const [selectedDay, setSelectedDay] = useState(getTodayKey());
  const [weekScores, setWeekScores] = useState(() => {
    const saved = localStorage.getItem("weight-loss-week-scores-v1");
    return saved ? JSON.parse(saved) : defaultWeek;
  });

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("weight-loss-completed-v1");
    return saved ? JSON.parse(saved) : { Michael: {}, Sarah: {} };
  });

  const [weights, setWeights] = useState(() => {
    const saved = localStorage.getItem("weight-loss-weights-v1");
    return saved ? JSON.parse(saved) : defaultWeights;
  });

  const [customTasks, setCustomTasks] = useState(() => {
    const saved = localStorage.getItem("weight-loss-custom-tasks-v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyCompleted, setMonthlyCompleted] = useState(() => {
    const saved = localStorage.getItem("weight-loss-monthly-wellbeing-v1");
    return saved ? JSON.parse(saved) : {};
  });

  const [newTask, setNewTask] = useState({
    title: "",
    category: "Habit",
    points: 1,
    person: "both",
    dayType: "all",
    weather: "all",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem("weight-loss-week-scores-v1", JSON.stringify(weekScores));
  }, [weekScores]);

  useEffect(() => {
    localStorage.setItem("weight-loss-completed-v1", JSON.stringify(completed));
  }, [completed]);

  useEffect(() => {
    localStorage.setItem("weight-loss-weights-v1", JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem("weight-loss-custom-tasks-v1", JSON.stringify(customTasks));
  }, [customTasks]);

  useEffect(() => {
    localStorage.setItem("weight-loss-monthly-wellbeing-v1", JSON.stringify(monthlyCompleted));
  }, [monthlyCompleted]);

  const taskLibrary = useMemo(() => [...BASE_TASK_LIBRARY, ...customTasks], [customTasks]);

  const michaelTasks = useMemo(() => getSuggestedTasks(taskLibrary, dayType, weather, "Michael"), [taskLibrary, dayType, weather]);
  const sarahTasks = useMemo(() => getSuggestedTasks(taskLibrary, dayType, weather, "Sarah"), [taskLibrary, dayType, weather]);

  const dailyScore = (person) => weekScores[person][selectedDay] || 0;
  const weeklyScore = (person) => Object.values(weekScores[person]).reduce((sum, value) => sum + value, 0);

  const toggleTask = (person, task) => {
    const dayTaskKey = `${selectedDay}-${task.id}`;
    const isDone = !!completed?.[person]?.[dayTaskKey];

    setCompleted((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [dayTaskKey]: !isDone,
      },
    }));

    setWeekScores((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [selectedDay]: Math.max(0, (prev[person][selectedDay] || 0) + (isDone ? -task.points : task.points)),
      },
    }));
  };

  const resetSelectedDay = () => {
    const freshCompleted = { ...completed };
    ["Michael", "Sarah"].forEach((person) => {
      Object.keys(freshCompleted[person] || {}).forEach((key) => {
        if (key.startsWith(`${selectedDay}-`)) {
          delete freshCompleted[person][key];
        }
      });
    });

    setCompleted(freshCompleted);
    setWeekScores((prev) => ({
      ...prev,
      Michael: { ...prev.Michael, [selectedDay]: 0 },
      Sarah: { ...prev.Sarah, [selectedDay]: 0 },
    }));
  };

  const getWeightPoints = (person) => {
    const starting = parseFloat(weights[person]?.starting);
    const current = parseFloat(weights[person]?.current);
    if (Number.isNaN(starting) || Number.isNaN(current)) return 0;
    const diff = starting - current;
    if (diff > 0) return 5;
    if (diff < 0) return -5;
    return 0;
  };

  const updateWeight = (person, field, value) => {
    setWeights((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value,
      },
    }));
  };

  const addCustomTask = () => {
    if (!newTask.title.trim()) return;
    const personMap = newTask.person === "both" ? ["Michael", "Sarah"] : [newTask.person];
    const dayTypeMap = newTask.dayType === "all" ? ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"] : [newTask.dayType];
    const weatherMap = newTask.weather === "all" ? ["good", "mixed", "bad"] : [newTask.weather];

    const customTask = {
      id: `custom_${Date.now()}`,
      title: newTask.title.trim(),
      category: newTask.category,
      points: Number(newTask.points),
      people: personMap,
      dayTypes: dayTypeMap,
      weather: weatherMap,
      description: newTask.description.trim() || "Custom task",
    };

    setCustomTasks((prev) => [...prev, customTask]);
    setNewTask({
      title: "",
      category: "Habit",
      points: 1,
      person: "both",
      dayType: "all",
      weather: "all",
      description: "",
    });
  };

  const toggleMonthlyTask = (taskId) => {
    setMonthlyCompleted((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const monthlyWellbeingPoints = MONTHLY_WELLBEING_TASKS.reduce((sum, task) => {
    return monthlyCompleted[task.id] ? sum + task.points : sum;
  }, 0);

  const getWeighInSummary = (person) => {
    const starting = parseFloat(weights[person]?.starting);
    const current = parseFloat(weights[person]?.current);
    if (Number.isNaN(starting) || Number.isNaN(current)) {
      return { label: "No weigh-in yet", changeText: "Add starting and Friday weight" };
    }
    const diff = +(current - starting).toFixed(1);
    if (diff < 0) {
      return { label: "Down this week", changeText: `${Math.abs(diff).toFixed(1)} kg down` };
    }
    if (diff > 0) {
      return { label: "Up this week", changeText: `${diff.toFixed(1)} kg up` };
    }
    return { label: "Maintained", changeText: "No weight change" };
  };

  const removeCustomTask = (taskId) => {
    setCustomTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const michaelWeekly = weeklyScore("Michael") + getWeightPoints("Michael");
  const sarahWeekly = weeklyScore("Sarah") + getWeightPoints("Sarah");
  const winnerText = michaelWeekly === sarahWeekly ? "It’s a tie this week" : michaelWeekly > sarahWeekly ? "Michael is winning this week" : "Sarah is winning this week";

  const PersonColumn = ({ person, tasks }) => {
    const totalPossible = tasks.reduce((sum, task) => sum + task.points, 0) || 1;
    const progress = Math.round((dailyScore(person) / totalPossible) * 100);

    return (
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <div className={`bg-gradient-to-r ${personColors[person]} p-4 text-white`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{person}</h2>
              <p className="text-sm text-white/80">Daily score: {dailyScore(person)} | Weekly: {weeklyScore(person) + getWeightPoints(person)}</p>
            </div>
            <Trophy className="w-6 h-6" />
          </div>
          <div className="mt-3">
            <Progress value={Math.min(progress, 100)} className="h-2 bg-white/20" />
            <p className="text-xs mt-2 text-white/80">{dailyScore(person)} of {totalPossible} possible points today</p>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {tasks.map((task) => {
            const checked = !!completed?.[person]?.[`${selectedDay}-${task.id}`];
            return (
              <button
                key={`${person}-${task.id}`}
                onClick={() => toggleTask(person, task)}
                className={`w-full text-left rounded-2xl border p-3 transition-all ${
                  checked ? "bg-green-50 border-green-300" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={checked} className="mt-1 pointer-events-none" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-slate-900">{task.title}</p>
                      <Badge variant="secondary" className="shrink-0">{task.points} pts</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{task.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-md mx-auto px-4 py-5 space-y-4">
        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 text-white">
            <div className="flex items-center gap-3">
              <Flame className="w-7 h-7" />
              <div>
                <h1 className="text-2xl font-bold">Weight Loss Challenge</h1>
                <p className="text-sm text-white/85">Michael & Sarah tracker</p>
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2"><Home className="w-4 h-4" /> Day type</p>
                <Select value={dayType} onValueChange={setDayType}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Select day type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_TYPES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2"><CloudSun className="w-4 h-4" /> Weather</p>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEATHER_TYPES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Tracking day</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    className="rounded-2xl"
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-600" />
                <p>
                  Suggested tasks adapt to <span className="font-semibold">day type</span> and <span className="font-semibold">weather</span>. Tap tasks to mark them done and scores update automatically.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full rounded-2xl" onClick={resetSelectedDay}>
              Reset selected day
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Scale className="w-5 h-5" /> Friday weigh-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Michael", "Sarah"].map((person) => {
              const weightPoints = getWeightPoints(person);
              const summary = getWeighInSummary(person);
              return (
                <div key={person} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{person}</h3>
                    <Badge variant={weightPoints >= 0 ? "secondary" : "destructive"}>
                      {weightPoints > 0 ? `+${weightPoints}` : weightPoints} weigh-in pts
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Starting weight</label>
                      <input
                        type="number"
                        step="0.1"
                        value={weights[person]?.starting || ""}
                        onChange={(e) => updateWeight(person, "starting", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        placeholder="e.g. 92.5"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Friday weight</label>
                      <input
                        type="number"
                        step="0.1"
                        value={weights[person]?.current || ""}
                        onChange={(e) => updateWeight(person, "current", e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                        placeholder="e.g. 91.8"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
                    <p className="font-semibold text-sm text-slate-900">{summary.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{summary.changeText}</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Current rule: down on weight = +5 points, no change = 0, up on weight = -5.
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Weekly winner</h2>
                <p className="text-sm text-white/85">{winnerText}</p>
              </div>
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <CardContent className="p-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500">Michael</p>
              <p className="text-2xl font-bold text-slate-900">{michaelWeekly}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-center">
              <p className="text-xs text-slate-500">Sarah</p>
              <p className="text-2xl font-bold text-slate-900">{sarahWeekly}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Add custom task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Task name"
            />
            <input
              value={newTask.description}
              onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Short description"
            />
            <div className="grid grid-cols-2 gap-3">
              <select value={newTask.category} onChange={(e) => setNewTask((prev) => ({ ...prev, category: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm">
                {["Activity", "Habit", "Food", "Discipline", "Commitment"].map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <select value={newTask.points} onChange={(e) => setNewTask((prev) => ({ ...prev, points: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm">
                {[1,2,3,5].map((option) => <option key={option} value={option}>{option} pts</option>)}
              </select>
              <select value={newTask.person} onChange={(e) => setNewTask((prev) => ({ ...prev, person: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm">
                <option value="both">Both</option>
                <option value="Michael">Michael</option>
                <option value="Sarah">Sarah</option>
              </select>
              <select value={newTask.dayType} onChange={(e) => setNewTask((prev) => ({ ...prev, dayType: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All day types</option>
                <option value="both_wfh">Both WFH</option>
                <option value="mixed">One WFH / One Office</option>
                <option value="both_office">Both Office</option>
                <option value="annual_leave">Annual Leave / Day Off</option>
                <option value="flexi_leave">Flexi Leave</option>
                <option value="weekend">Weekend / Mostly Off</option>
              </select>
              <select value={newTask.weather} onChange={(e) => setNewTask((prev) => ({ ...prev, weather: e.target.value }))} className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm col-span-2">
                <option value="all">All weather</option>
                <option value="good">Good / Dry</option>
                <option value="mixed">Mixed</option>
                <option value="bad">Bad / Wet</option>
              </select>
            </div>
            <Button className="w-full rounded-2xl" onClick={addCustomTask}>Add custom task</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Custom task history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customTasks.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-500">
                No custom tasks yet.
              </div>
            ) : (
              customTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-slate-200 p-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge variant="secondary">{task.points} pts</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl" onClick={() => removeCustomTask(task.id)}>Remove</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Monthly wellbeing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-3">
              <div>
                <p className="font-semibold text-slate-900">Monthly wellbeing score</p>
                <p className="text-xs text-slate-500">Tracked separately from the weekly competition so wellbeing supports the challenge instead of distorting it.</p>
              </div>
              <Badge>{monthlyWellbeingPoints} pts</Badge>
            </div>
            {MONTHLY_WELLBEING_TASKS.map((task) => {
              const checked = !!monthlyCompleted[task.id];
              return (
                <button
                  key={task.id}
                  onClick={() => toggleMonthlyTask(task.id)}
                  className={`w-full text-left rounded-2xl border p-3 transition-all ${checked ? "bg-emerald-50 border-emerald-300" : "bg-white border-slate-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={checked} className="mt-1 pointer-events-none" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-slate-900">{task.title}</p>
                        <Badge variant="secondary">{task.points} pts</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{task.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid grid-cols-2 rounded-2xl">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Weekly Totals</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <PersonColumn person="Michael" tasks={michaelTasks} />
            <PersonColumn person="Sarah" tasks={sarahTasks} />
          </TabsContent>

          <TabsContent value="week">
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Building2 className="w-5 h-5" /> Weekly scoreboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {["Michael", "Sarah"].map((person) => (
                  <div key={person} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900">{person}</h3>
                      <Badge>{weeklyScore(person) + getWeightPoints(person)} pts</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm sm:grid-cols-7">
                      {Object.entries(weekScores[person]).map(([day, score]) => (
                        <div key={day} className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                          <p className="text-slate-500 text-xs">{day}</p>
                          <p className="font-bold text-slate-900 mt-1">{score}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
