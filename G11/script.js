document.getElementById("search-btn").addEventListener("click", searchStudent);
    document.getElementById("admission-number").addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchStudent();
    });


    

    function searchStudent() {
      const admissionNumber = document.getElementById("admission-number").value;
      const student = data[admissionNumber];
      if (student) {
        const totalMarks = student.marks.reduce((a, b) => a + b, 0);
        const averageMarks = (totalMarks / student.marks.length).toFixed(2);
        const totalStudents = Object.keys(data).length;
        document.getElementById("student-name").textContent = student.name;
        document.getElementById("total-marks-display").textContent = totalMarks;
        document.getElementById("place-rank").textContent = `#${student.place} (out of 50)`;
        document.getElementById("average-marks").textContent = `${averageMarks}%`;
        initChart(student);
        updateGradeDistribution(student);
        updateSubjectDetails(student);
        document.getElementById("report-section").style.display = "block";
        document.getElementById("legend").style.display = "block"; // Show the legend
      } else {
        alert("Student not found! Please check admission number.");
        document.getElementById("legend").style.display = "none"; // Hide the legend if student not found
      }
    }

    function initChart(student) {
  const canvas = document.getElementById('marks-chart');
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth <= 768;

  // ✅ Remove old fixed size from previous chart render
  canvas.removeAttribute('width');
  canvas.removeAttribute('height');

  // ✅ Ensure container has a fixed height so Chart.js can fill it
  canvas.parentElement.style.height = '400px'; // You can adjust this height

function triggerConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  const confettiSettings = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  };

  function frame() {
    confetti({
      ...confettiSettings,
      colors: ['#28a745', '#f0ad4e', '#17a2b8', '#dc3545']
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

  // Get CSS variable colors
  const styles = getComputedStyle(document.documentElement);
  const successColor = styles.getPropertyValue('--success').trim();
  const warningColor = styles.getPropertyValue('--warning').trim();
  const infoColor = styles.getPropertyValue('--info').trim();
  const accentColor = styles.getPropertyValue('--accent').trim();
  const dangerColor = styles.getPropertyValue('--danger').trim();

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: student.subjects.map((subject, index) => `${subject} (${student.marks[index]})`),
      datasets: [{
        data: student.marks,
        backgroundColor: student.marks.map(m => 
          m >= 75 ? successColor : 
          m >= 65 ? warningColor : 
          m >= 50 ? infoColor : 
          m >= 35 ? accentColor : dangerColor
        ),
        borderColor: '#2c3e50',
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Let height be controlled by container
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: '#dfe6e9' },
          ticks: { color: '#2c3e50', font: { size: isMobile ? 12 : 14 } }
        },
        x: {
          grid: { display: false },
          ticks: {
            color: '#2c3e50',
            font: { size: isMobile ? 10 : 12 },
            autoSkip: false,
            maxRotation: isMobile ? 90 : 0,
            minRotation: isMobile ? 90 : 0
          }
        }
      },
      plugins: {
        legend: { display: false },
        annotation: {
          annotations: {
            passLine: {
              type: 'line',
              yMin: 35,
              yMax: 35,
              borderColor: '#e74c3c',
              borderWidth: 3,
              borderDash: [5, 3],
              label: {
                content: 'Pass (35)',
                display: true,
                position: 'end',
                backgroundColor: '#e74c3c',
                color: 'white'
              }
            },
            distinctionLine: {
              type: 'line',
              yMin: 75,
              yMax: 75,
              borderColor: '#FFD700',
              borderWidth: 3,
              borderDash: [5, 3],
              label: {
                content: 'Distinction (75)',
                display: true,
                position: 'end',
                backgroundColor: '#FFD700',
                color: '#2c3e50'
              }
            }
          }
        }
      }
    }
  });
}




    function updateGradeDistribution(student) {
      const gradeCounts = { A: 0, B: 0, C: 0, S: 0, W: 0 };
      student.marks.forEach(mark => {
        if (mark >= 75) gradeCounts.A++;
        else if (mark >= 65) gradeCounts.B++;
        else if (mark >= 50) gradeCounts.C++;
        else if (mark >= 35) gradeCounts.S++;
        else gradeCounts.W++;
      });
      const gradeDistributionDiv = document.getElementById("grade-distribution");
      gradeDistributionDiv.innerHTML = `
        ${gradeCounts.A > 0 ? `<span class="badge success">A: ${gradeCounts.A}</span>` : ''}
        ${gradeCounts.B > 0 ? `<span class="badge warning">B: ${gradeCounts.B}</span>` : ''}
        ${gradeCounts.C > 0 ? `<span class="badge info">C: ${gradeCounts.C}</span>` : ''}
        ${gradeCounts.S > 0 ? `<span class="badge accent">S: ${gradeCounts.S}</span>` : ''}
        ${gradeCounts.W > 0 ? `<span class="badge danger">W: ${gradeCounts.W}</span>` : ''}
      `;
    }

    function updateSubjectDetails(student) {
      const subjectDetailsDiv = document.getElementById("subject-details");
      subjectDetailsDiv.innerHTML = "";
      student.marks.forEach((mark, index) => {
        let badgeClass = '';
        if (mark >= 75) badgeClass = 'success'; // A
        else if (mark >= 65) badgeClass = 'warning'; // B
        else if (mark >= 50) badgeClass = 'info'; // C
        else if (mark >= 35) badgeClass = 'accent'; // S
        else badgeClass = 'danger'; // W
        const subjectBadge = document.createElement("span");
        subjectBadge.className = `badge ${badgeClass}`;
        subjectBadge.textContent = `${student.subjects[index]}: ${mark}`;
        subjectDetailsDiv.appendChild(subjectBadge);
      });

    }

