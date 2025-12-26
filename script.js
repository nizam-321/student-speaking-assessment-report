//    Default Fallback Data

let assessmentData = {
  studentName: "John Doe",
  testDate: "25 Dec 2025",
  overallScore: 6,
  skills: {
    pronunciation: 8.5,
    fluency: 6.8,
    vocabulary: 8,
    grammar: 3.5,
  },
};

//    Data Loader
//    Fetch external JSON or fallback

async function loadData() {
  try {
    const response = await fetch("data.json");
    return await response.json();
  } catch (error) {
    console.error("Error loading data:", error);
    return assessmentData;
  }
}

//    App Initialization

document.addEventListener("DOMContentLoaded", async () => {
  assessmentData = await loadData();
  loadStudentInfo();
  loadScores();
  loadFeedback();
  initChart();
});

//    Student Info

function loadStudentInfo() {
  document.getElementById("studentName").innerText = assessmentData.studentName;
  document.getElementById("testDate").innerText = assessmentData.testDate;
  document.getElementById("overallScore").innerText =
    assessmentData.overallScore;
}

//    Skill Scores & Progress Bars

function loadScores() {
  setSkill(
    "pronScore",
    ".skill-fill.pronunciation",
    assessmentData.skills.pronunciation
  );
  setSkill("fluScore", ".skill-fill.fluency", assessmentData.skills.fluency);
  setSkill(
    "vocabScore",
    ".skill-fill.vocabulary",
    assessmentData.skills.vocabulary
  );
  setSkill("gramScore", ".skill-fill.grammar", assessmentData.skills.grammar);
}

function setSkill(scoreId, barSelector, score) {
  const scoreElement = document.getElementById(scoreId);
  scoreElement.innerText = score;

  const percentage = (score / 9) * 100;
  const bar = document.querySelector(barSelector);
  const colors = getColorByScore(score);

  bar.style.backgroundColor = colors.solid;
  scoreElement.style.color = colors.solid;

  setTimeout(() => {
    bar.style.width = `${percentage}%`;
  }, 200);
}

//    Feedback Section

function loadFeedback() {
  const setFeedback = (textId, scoreId, skill, score) => {
    document.getElementById(textId).innerText = generateFeedback(skill, score);
    const scoreDisplay = document.getElementById(scoreId);
    scoreDisplay.innerText = score;
    scoreDisplay.style.color = getColorByScore(score).solid;
  };

  setFeedback(
    "overallFeedback",
    "overallScoreDisplay",
    "overall",
    assessmentData.overallScore
  );
  setFeedback(
    "pronFeedback",
    "pronScoreDisplay",
    "pronunciation",
    assessmentData.skills.pronunciation
  );
  setFeedback(
    "fluFeedback",
    "fluScoreDisplay",
    "fluency",
    assessmentData.skills.fluency
  );
  setFeedback(
    "vocabFeedback",
    "vocabScoreDisplay",
    "vocabulary",
    assessmentData.skills.vocabulary
  );
  setFeedback(
    "gramFeedback",
    "gramScoreDisplay",
    "grammar",
    assessmentData.skills.grammar
  );

  const overallColor = getColorByScore(assessmentData.overallScore).solid;
  document.body.style.setProperty("--overall-color", overallColor);
}

//    Feedback Generator

function generateFeedback(skill, score) {
  const isLow = score < 5;
  const isMedium = score >= 5 && score < 8;
  const isHigh = score >= 8;

  const feedbackMap = {
    overall: {
      high: "Excellent overall performance with strong control and clarity.",
      medium: "Good overall performance with scope for minor improvements.",
      low: "Overall performance needs improvement in clarity and accuracy.",
    },
    pronunciation: {
      high: "Excellent pronunciation with natural intonation.",
      medium: "Good pronunciation with minor issues.",
      low: "Pronunciation needs improvement and clearer articulation.",
    },
    fluency: {
      high: "Excellent fluency with smooth speech flow.",
      medium: "Good fluency with occasional hesitation.",
      low: "Fluency needs improvement and fewer pauses.",
    },
    vocabulary: {
      high: "Excellent vocabulary with precise word usage.",
      medium: "Good vocabulary range; can be expanded further.",
      low: "Vocabulary needs improvement and variation.",
    },
    grammar: {
      high: "Excellent grammar with complex structures.",
      medium: "Good grammar with minor inconsistencies.",
      low: "Grammar needs improvement and error reduction.",
    },
  };

  if (!feedbackMap[skill]) return "Feedback not available.";

  if (isHigh) return feedbackMap[skill].high;
  if (isMedium) return feedbackMap[skill].medium;
  return feedbackMap[skill].low;
}

//    Score Color Logic

function getColorByScore(score) {
  if (score < 5) {
    return { solid: "#ef4444", rgba: "rgba(239, 68, 68, 0.7)" };
  }
  if (score < 8) {
    return { solid: "#4ade80", rgba: "rgba(74, 222, 128, 0.7)" };
  }
    return { solid: "#16a34a", rgba: "rgba(22, 163, 74, 0.7)" };
}

//    Chart Initialization

function initChart() {
  const ctx = document.getElementById("scoreChart").getContext("2d");

  const skills = ["pronunciation", "fluency", "vocabulary", "grammar"];
  const scores = skills.map((skill) => assessmentData.skills[skill]);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pronunciation", "Fluency", "Vocabulary", "Grammar"],
      datasets: [
        {
          label: "Score / 9",
          data: scores,
          backgroundColor: scores.map((s) => getColorByScore(s).rgba),
          borderColor: scores.map((s) => getColorByScore(s).solid),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 9,
          ticks: { stepSize: 1 },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}
