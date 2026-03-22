import React, { useEffect, useMemo, useState } from "react";
import "./styles.css";

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
  Michael: "header-dark",
  Sarah: "header-pink",
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

function getBadgeClass(kind) {
  if (kind === "outline") return "badge badge-outline";
  if (kind === "danger") return "badge badge-danger";
  return "badge";
}

function ProgressBar({ value }) {
  return (
    <div className="progress-shell">
      <div className="progress-fill" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function App() {
  const [dayType, setDayType] = useState("both_wfh");
  const [weather, setWeather] = useState("good");
  const [selectedDay, setSelectedDay] = useState(getTodayKey());
  const [activeTab, setActiveTab] = useState("today");
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
    const dayTypeMap = newTask.dayType === "all"
      ? ["both_wfh", "mixed", "both_office", "annual_leave", "flexi_leave", "weekend"]
      : [newTask.dayType];
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

  const removeCustomTask = (taskId) => {
    setCustomTasks((prev) => prev.filter((task) => task.id !== taskId));
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

  const michaelWeekly = weeklyScore("Michael") + getWeightPoints("Michael");
  const sarahWeekly = weeklyScore("Sarah") + getWeightPoints("Sarah");
  const winnerText = michaelWeekly === sarahWeekly
    ? "It’s a tie this week"
    : michaelWeekly > sarahWeekly
      ? "Michael is winning this week"
      : "Sarah is winning this week";

  const people = [
    { name: "Michael", tasks: michaelTasks },
    { name: "Sarah", tasks: sarahTasks },
  ];

  return (
    <div className="app-shell">
      <div className="app-container">
        <section className="panel hero-panel">
          <div className="hero-header">
            <div>
              <h1>Weight Loss Challenge</h1>
              <p>Michael &amp; Sarah tracker</p>
            </div>
          </div>

          <div className="panel-body stacked-gap">
            <div className="field-group">
              <label htmlFor="dayType">Day type</label>
              <select id="dayType" value={dayType} onChange={(e) => setDayType(e.target.value)}>
                {DAY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="weather">Weather</label>
              <select id="weather" value={weather} onChange={(e) => setWeather(e.target.value)}>
                {WEATHER_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="label-row">Tracking day</div>
              <div className="day-grid">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    key={day}
                    className={selectedDay === day ? "day-btn active" : "day-btn"}
                    onClick={() => setSelectedDay(day)}
                    type="button"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="info-box">
              Suggested tasks adapt to <strong>day type</strong> and <strong>weather</strong>. Tap tasks to mark them done and scores update automatically.
            </div>

            <button className="secondary-btn full-width" onClick={resetSelectedDay} type="button">
              Reset selected day
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header simple-header">
            <h2>Friday weigh-in</h2>
          </div>
          <div className="panel-body stacked-gap">
            {["Michael", "Sarah"].map((person) => {
              const weightPoints = getWeightPoints(person);
              const summary = getWeighInSummary(person);
              return (
                <div key={person} className="box-card">
                  <div className="row-between">
                    <h3>{person}</h3>
                    <span className={weightPoints >= 0 ? getBadgeClass() : getBadgeClass("danger")}>
                      {weightPoints > 0 ? `+${weightPoints}` : weightPoints} weigh-in pts
                    </span>
                  </div>
                  <div className="two-col-grid">
                    <div className="field-group">
                      <label>Starting weight</label>
                      <input
                        type="number"
                        step="0.1"
                        value={weights[person]?.starting || ""}
                        onChange={(e) => updateWeight(person, "starting", e.target.value)}
                        placeholder="e.g. 92.5"
                      />
                    </div>
                    <div className="field-group">
                      <label>Friday weight</label>
                      <input
                        type="number"
                        step="0.1"
                        value={weights[person]?.current || ""}
                        onChange={(e) => updateWeight(person, "current", e.target.value)}
                        placeholder="e.g. 91.8"
                      />
                    </div>
                  </div>
                  <div className="muted-box">
                    <strong>{summary.label}</strong>
                    <div>{summary.changeText}</div>
                  </div>
                  <p className="tiny-text">Current rule: down on weight = +5 points, no change = 0, up on weight = -5.</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel winner-panel">
          <div className="panel-header winner-header">
            <div>
              <h2>Weekly winner</h2>
              <p>{winnerText}</p>
            </div>
          </div>
          <div className="panel-body two-col-grid">
            <div className="score-tile">
              <div className="score-name">Michael</div>
              <div className="score-value">{michaelWeekly}</div>
            </div>
            <div className="score-tile">
              <div className="score-name">Sarah</div>
              <div className="score-value">{sarahWeekly}</div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header simple-header">
            <h2>Add custom task</h2>
          </div>
          <div className="panel-body stacked-gap">
            <div className="field-group">
              <label>Task name</label>
              <input
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Task name"
              />
            </div>
            <div className="field-group">
              <label>Short description</label>
              <input
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div className="two-col-grid">
              <div className="field-group">
                <label>Category</label>
                <select value={newTask.category} onChange={(e) => setNewTask((prev) => ({ ...prev, category: e.target.value }))}>
                  {["Activity", "Habit", "Food", "Discipline", "Commitment"].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label>Points</label>
                <select value={newTask.points} onChange={(e) => setNewTask((prev) => ({ ...prev, points: e.target.value }))}>
                  {[1, 2, 3, 5].map((option) => (
                    <option key={option} value={option}>{option} pts</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label>Who</label>
                <select value={newTask.person} onChange={(e) => setNewTask((prev) => ({ ...prev, person: e.target.value }))}>
                  <option value="both">Both</option>
                  <option value="Michael">Michael</option>
                  <option value="Sarah">Sarah</option>
                </select>
              </div>
              <div className="field-group">
                <label>Day type</label>
                <select value={newTask.dayType} onChange={(e) => setNewTask((prev) => ({ ...prev, dayType: e.target.value }))}>
                  <option value="all">All day types</option>
                  <option value="both_wfh">Both WFH</option>
                  <option value="mixed">One WFH / One Office</option>
                  <option value="both_office">Both Office</option>
                  <option value="annual_leave">Annual Leave / Day Off</option>
                  <option value="flexi_leave">Flexi Leave</option>
                  <option value="weekend">Weekend / Mostly Off</option>
                </select>
              </div>
              <div className="field-group full-span">
                <label>Weather</label>
                <select value={newTask.weather} onChange={(e) => setNewTask((prev) => ({ ...prev, weather: e.target.value }))}>
                  <option value="all">All weather</option>
                  <option value="good">Good / Dry</option>
                  <option value="mixed">Mixed</option>
                  <option value="bad">Bad / Wet</option>
                </select>
              </div>
            </div>
            <button className="primary-btn full-width" onClick={addCustomTask} type="button">
              Add custom task
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header simple-header">
            <h2>Custom task history</h2>
          </div>
          <div className="panel-body stacked-gap">
            {customTasks.length === 0 ? (
              <div className="muted-box">No custom tasks yet.</div>
            ) : (
              customTasks.map((task) => (
                <div key={task.id} className="box-card">
                  <div className="row-between align-start gap-12">
                    <div>
                      <div className="task-title">{task.title}</div>
                      <div className="task-description">{task.description}</div>
                      <div className="badge-row">
                        <span className={getBadgeClass("outline")}>{task.category}</span>
                        <span className={getBadgeClass()}>{task.points} pts</span>
                      </div>
                    </div>
                    <button className="secondary-btn" onClick={() => removeCustomTask(task.id)} type="button">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header simple-header">
            <h2>Monthly wellbeing</h2>
          </div>
          <div className="panel-body stacked-gap">
            <div className="row-between muted-box">
              <div>
                <strong>Monthly wellbeing score</strong>
                <div className="task-description">Tracked separately from the weekly competition so wellbeing supports the challenge instead of distorting it.</div>
              </div>
              <span className={getBadgeClass()}>{monthlyWellbeingPoints} pts</span>
            </div>

            {MONTHLY_WELLBEING_TASKS.map((task) => {
              const checked = !!monthlyCompleted[task.id];
              return (
                <button
                  key={task.id}
                  onClick={() => toggleMonthlyTask(task.id)}
                  className={checked ? "task-btn task-btn-checked" : "task-btn"}
                  type="button"
                >
                  <div className="task-checkbox">{checked ? "✓" : "○"}</div>
                  <div className="task-main">
                    <div className="row-between gap-12">
                      <div className="task-title">{task.title}</div>
                      <span className={getBadgeClass()}>{task.points} pts</span>
                    </div>
                    <div className="task-description">{task.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="tab-row">
            <button className={activeTab === "today" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("today")} type="button">
              Today
            </button>
            <button className={activeTab === "week" ? "tab-btn active" : "tab-btn"} onClick={() => setActiveTab("week")} type="button">
              Weekly Totals
            </button>
          </div>

          <div className="panel-body">
            {activeTab === "today" ? (
              <div className="stacked-gap">
                {people.map(({ name, tasks }) => {
                  const totalPossible = tasks.reduce((sum, task) => sum + task.points, 0) || 1;
                  const progress = Math.round((dailyScore(name) / totalPossible) * 100);
                  return (
                    <section className="person-panel" key={name}>
                      <div className={`person-header ${personColors[name]}`}>
                        <div className="row-between gap-12">
                          <div>
                            <h2>{name}</h2>
                            <p>Daily score: {dailyScore(name)} | Weekly: {weeklyScore(name) + getWeightPoints(name)}</p>
                          </div>
                          <div className="trophy-icon">🏆</div>
                        </div>
                        <div className="progress-block">
                          <ProgressBar value={progress} />
                          <p>{dailyScore(name)} of {totalPossible} possible points today</p>
                        </div>
                      </div>

                      <div className="person-body stacked-gap">
                        {tasks.map((task) => {
                          const checked = !!completed?.[name]?.[`${selectedDay}-${task.id}`];
                          return (
                            <button
                              key={`${name}-${task.id}`}
                              onClick={() => toggleTask(name, task)}
                              className={checked ? "task-btn task-btn-checked" : "task-btn"}
                              type="button"
                            >
                              <div className="task-checkbox">{checked ? "✓" : "○"}</div>
                              <div className="task-main">
                                <div className="row-between gap-12">
                                  <div className="task-title">{task.title}</div>
                                  <span className={getBadgeClass()}>{task.points} pts</span>
                                </div>
                                <div className="badge-row">
                                  <span className={getBadgeClass("outline")}>{task.category}</span>
                                </div>
                                <div className="task-description">{task.description}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="stacked-gap">
                {["Michael", "Sarah"].map((person) => (
                  <div key={person} className="box-card">
                    <div className="row-between">
                      <h3>{person}</h3>
                      <span className={getBadgeClass()}>{weeklyScore(person) + getWeightPoints(person)} pts</span>
                    </div>
                    <div className="week-grid">
                      {Object.entries(weekScores[person]).map(([day, score]) => (
                        <div key={day} className="score-tile small-tile">
                          <div className="score-name">{day}</div>
                          <div className="score-value small-value">{score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
