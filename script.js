/*
 * ملف JavaScript لإدارة الموقع الإلكتروني لعيادة العلاج الفيزيائي.
 * يوفر هذا الملف وظائف للتنقل بين الأقسام المختلفة (الرئيسية، المرضى، المواعيد، خطط التمارين، التقارير، الإعدادات)،
 * وإضافة مرضى ومواعيد وخطط علاج وتحديث الجداول والإحصائيات بشكل ديناميكي.
 * يتم حفظ البيانات في الذاكرة المحلية (localStorage) لضمان وجودها بعد إعادة تحميل الصفحة.
 */

// مصفوفات لتخزين البيانات في الذاكرة
let patients = [];
let appointments = [];
let exercisePlans = [];

// تحميل البيانات من التخزين المحلي عند بداية تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    // تأكد من عرض القسم النشط الأولي
    showSection('home');
});

/**
 * عرض قسم معين وإخفاء بقية الأقسام.
 * @param {string} id - معرف القسم المراد عرضه.
 */
function showSection(id) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        if (section.id === id) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

/**
 * إضافة مريض جديد إلى الجدول والمصفوفة.
 * @param {Event} event - حدث الإرسال من النموذج.
 */
function addPatient(event) {
    event.preventDefault();
    const name = document.getElementById('patientName').value.trim();
    const age = parseInt(document.getElementById('patientAge').value, 10);
    const condition = document.getElementById('patientCondition').value.trim();
    const notes = document.getElementById('patientNotes').value.trim();

    // تأكد من عدم وجود مدخلات فارغة
    if (!name || isNaN(age) || !condition) {
        alert('يرجى ملء جميع الحقول المطلوبة.');
        return;
    }

    // إنشاء كائن المريض وإضافته للمصفوفة
    const patient = { name, age, condition, notes };
    patients.push(patient);
    saveData();
    updatePatientTable();
    updateCounts();

    // إعادة تعيين النموذج
    document.getElementById('patientForm').reset();
}

/**
 * تحديث جدول المرضى في واجهة الموقع.
 */
function updatePatientTable() {
    const tbody = document.querySelector('#patientTable tbody');
    // مسح الصفوف السابقة
    tbody.innerHTML = '';
    // إضافة صف لكل مريض
    patients.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.condition}</td>
            <td>${patient.notes}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * إضافة موعد جديد للمصفوفة والجدول.
 * @param {Event} event - حدث الإرسال من النموذج.
 */
function addAppointment(event) {
    event.preventDefault();
    const patient = document.getElementById('appointmentPatient').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const notes = document.getElementById('appointmentNotes').value.trim();

    if (!patient || !date) {
        alert('يرجى ملء جميع الحقول المطلوبة.');
        return;
    }

    const appointment = { patient, date, notes };
    appointments.push(appointment);
    saveData();
    updateAppointmentTable();
    updateCounts();
    document.getElementById('appointmentForm').reset();
}

/**
 * تحديث جدول المواعيد على الصفحة.
 */
function updateAppointmentTable() {
    const tbody = document.querySelector('#appointmentTable tbody');
    tbody.innerHTML = '';
    appointments.forEach(app => {
        const row = document.createElement('tr');
        // تنسيق التاريخ والوقت للعرض بشكل مفهوم للمستخدم (حسب المنطقة الزمنية المحلية)
        const dateObj = new Date(app.date);
        const formattedDate = dateObj.toLocaleString('ar-EG', { hour12: false });
        row.innerHTML = `
            <td>${app.patient}</td>
            <td>${formattedDate}</td>
            <td>${app.notes}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * إضافة خطة تمرين للمصفوفة والقائمة.
 * @param {Event} event - حدث الإرسال من النموذج.
 */
function addExercisePlan(event) {
    event.preventDefault();
    const patient = document.getElementById('exercisePatient').value.trim();
    const plan = document.getElementById('exercisePlan').value.trim();
    if (!patient || !plan) {
        alert('يرجى ملء جميع الحقول المطلوبة.');
        return;
    }
    const exercise = { patient, plan };
    exercisePlans.push(exercise);
    saveData();
    updateExerciseList();
    updateCounts();
    document.getElementById('exerciseForm').reset();
}

/**
 * تحديث قائمة خطط التمرين على الموقع.
 */
function updateExerciseList() {
    const list = document.getElementById('exerciseList');
    list.innerHTML = '';
    exercisePlans.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.patient}: ${item.plan}`;
        list.appendChild(li);
    });
}

/**
 * تحديث البطاقات الإحصائية لعدد المرضى والمواعيد وخطط التمارين.
 */
function updateCounts() {
    // تحديث عدادات الإحصاءات باللغة الإنجليزية
    document.getElementById('patientCount').textContent = `Patients: ${patients.length}`;
    document.getElementById('appointmentCount').textContent = `Appointments: ${appointments.length}`;
    document.getElementById('exerciseCount').textContent = `Exercise Plans: ${exercisePlans.length}`;
}

/**
 * حفظ البيانات في التخزين المحلي (localStorage).
 */
function saveData() {
    localStorage.setItem('patients', JSON.stringify(patients));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('exercisePlans', JSON.stringify(exercisePlans));
}

/**
 * تحميل البيانات المخزنة مسبقًا إذا كانت موجودة.
 */
function loadData() {
    const storedPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const storedExercises = JSON.parse(localStorage.getItem('exercisePlans') || '[]');
    patients = storedPatients;
    appointments = storedAppointments;
    exercisePlans = storedExercises;
    updatePatientTable();
    updateAppointmentTable();
    updateExerciseList();
    updateCounts();
}
