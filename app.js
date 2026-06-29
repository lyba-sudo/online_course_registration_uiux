const courses = [
  { dept: 'INFO', number: 'INFO 465', name: 'Projects in Information Systems', credits: 3, real: 'Yes', prereq: 'Senior standing', section: '001', instructor: 'Dr. Harper', modality: 'Hybrid', max: 10, enrolled: 8 },
  { dept: 'INFO', number: 'INFO 320', name: 'Business Intelligence', credits: 3, real: 'No', prereq: 'INFO 202', section: '901', instructor: 'Prof. Nguyen', modality: 'Online', max: 25, enrolled: 25 },
  { dept: 'INFO', number: 'INFO 364', name: 'Database Systems', credits: 3, real: 'No', prereq: 'INFO 202', section: '002', instructor: 'Dr. Patel', modality: 'In-person', max: 20, enrolled: 12 },
  { dept: 'INFO', number: 'INFO 350', name: 'Information Systems Security', credits: 3, real: 'Yes', prereq: 'INFO 202', section: '001', instructor: 'Dr. Harper', modality: 'Asynchronous', max: 18, enrolled: 9 },
  { dept: 'MATH', number: 'MATH 200', name: 'Statistics for Business', credits: 3, real: 'No', prereq: 'MATH 151', section: '003', instructor: 'Prof. Lewis', modality: 'Online', max: 30, enrolled: 16 }
];

let enrolled = [
  { number: 'INFO 465', name: 'Projects in Information Systems', section: '001', instructor: 'Dr. Harper', modality: 'Hybrid' },
  { number: 'INFO 364', name: 'Database Systems', section: '002', instructor: 'Dr. Patel', modality: 'In-person' }
];

function modalityBadge(modality) {
  const cls = modality.toLowerCase().includes('online') ? 'online' : modality.toLowerCase().includes('hybrid') ? 'hybrid' : 'open';
  return `<span class="badge ${cls}">${modality}</span>`;
}

function statusBadge(course) {
  return course.enrolled >= course.max ? '<span class="badge closed">Closed</span>' : '<span class="badge open">Open</span>';
}

function renderCourseRows(list, elementId, includeRegister = false) {
  const target = document.getElementById(elementId);
  if (!target) return;
  target.innerHTML = list.map(c => `
    <tr>
      <td><strong>${c.number}</strong><br>${c.name}<br><span class="notice">REAL: ${c.real}</span></td>
      <td>${c.section}</td>
      <td>${c.instructor}</td>
      <td>${c.credits}</td>
      <td>${c.prereq}</td>
      <td>${modalityBadge(c.modality)}</td>
      <td>${c.enrolled}/${c.max}<br>${statusBadge(c)}</td>
      ${includeRegister ? `<td><button onclick="registerCourse('${c.number}','${c.section}')">Register</button></td>` : ''}
    </tr>
  `).join('');
}

function searchCourses() {
  const dept = (document.getElementById('dept')?.value || '').toLowerCase();
  const instructor = (document.getElementById('instructor')?.value || '').toLowerCase();
  const courseNum = (document.getElementById('courseNum')?.value || '').toLowerCase();
  const filtered = courses.filter(c =>
    (!dept || c.dept.toLowerCase().includes(dept)) &&
    (!instructor || c.instructor.toLowerCase().includes(instructor)) &&
    (!courseNum || c.number.toLowerCase().includes(courseNum))
  );
  renderCourseRows(filtered, 'courseRows');
}

function renderEnrolled() {
  const target = document.getElementById('enrolledRows');
  if (!target) return;
  target.innerHTML = enrolled.map(c => `
    <tr><td>${c.number}</td><td>${c.name}</td><td>${c.section}</td><td>${c.instructor}</td><td>${c.modality}</td></tr>
  `).join('');
}

function registerCourse(number, section) {
  const message = document.getElementById('registerMessage');
  const course = courses.find(c => c.number === number && c.section === section);
  const duplicate = enrolled.some(e => e.number === number);
  if (!course) return;
  if (duplicate) {
    message.className = 'message bad';
    message.textContent = `Registration blocked: you are already enrolled in ${number}. Students cannot register for two sections of the same course.`;
    return;
  }
  if (course.enrolled >= course.max) {
    message.className = 'message bad';
    message.textContent = `Registration blocked: ${number}-${section} is full because enrollment reached ${course.max}.`;
    return;
  }
  course.enrolled += 1;
  enrolled.push({ number: course.number, name: course.name, section: course.section, instructor: course.instructor, modality: course.modality });
  message.className = 'message good';
  message.textContent = `Success: you are now registered for ${number}-${section}.`;
  renderEnrolled();
  renderCourseRows(courses, 'registrationRows', true);
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourseRows(courses, 'courseRows');
  renderCourseRows(courses, 'registrationRows', true);
  renderEnrolled();
});
