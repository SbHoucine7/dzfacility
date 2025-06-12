function switchCalculation(type) {
    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.option-button').forEach(button => button.classList.remove('active'));
    // إضافة الفئة النشطة للزر المحدد
    document.querySelector(`.option-button[onclick*="${type}"]`).classList.add('active');
    
    // إخفاء جميع النماذج
    document.querySelectorAll('.calculation-form').forEach(form => form.classList.remove('active'));
    // إظهار النموذج المحدد
    document.getElementById(`${type}Form`).classList.add('active');
    
    // إخفاء النتائج
    document.getElementById('result').style.display = 'none';
}

function formatInputNumber(input) {
    let value = input.value.replace(/[^\d,]/g, '');
    value = value.replace(/,/g, '');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    input.value = value;
}

function formatNumber(num) {
    // تقريب الرقم إلى أعلى قيمة صحيحة
    const roundedNum = Math.ceil(num * 1000) / 1000;
    // تحويل الرقم إلى سلسلة نصية مع إضافة الفواصل
    return Math.ceil(roundedNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateByMonths() {
    const priceStr = document.getElementById('price1').value.replace(/,/g, '');
    const price = parseFloat(priceStr);
    const months = parseInt(document.getElementById('months').value);
    const monthlyInterest = parseFloat(document.getElementById('interestRate1').value) / 100;
    
    if (!price || !months || !monthlyInterest || price <= 0 || months <= 0 || monthlyInterest < 0) {
        alert('الرجاء إدخال قيم صحيحة');
        return;
    }

    // حساب التكلفة الإجمالية باستخدام الفائدة البسيطة
    const totalCost = price * (1 + monthlyInterest * months);
    const monthlyPayment = totalCost / months;

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="result-grid">
            <div class="result-item">
                <p><strong>السعر الأصلي</strong></p>
                <p>${formatNumber(price)}</p>
            </div>
            <div class="result-item">
                <p><strong>إجمالي التكلفة مع الفائدة</strong></p>
                <p>${formatNumber(totalCost)}</p>
            </div>
            <div class="result-item">
                <p><strong>القسط الشهري</strong></p>
                <p>${formatNumber(monthlyPayment)}</p>
            </div>
            <div class="result-item">
                <p><strong>عدد الأشهر</strong></p>
                <p>${months}</p>
            </div>
            <div class="result-item">
                <p><strong>إجمالي الفائدة</strong></p>
                <p>${formatNumber(totalCost - price)}</p>
            </div>
        </div>
    `;
}

function calculateByAmount() {
    const priceStr = document.getElementById('price2').value.replace(/,/g, '');
    const price = parseFloat(priceStr);
    const monthlyAmountStr = document.getElementById('monthlyAmount').value.replace(/,/g, '');
    const monthlyAmount = parseFloat(monthlyAmountStr);
    const monthlyInterest = parseFloat(document.getElementById('interestRate2').value) / 100;
    
    if (!price || !monthlyAmount || !monthlyInterest || price <= 0 || monthlyAmount <= 0 || monthlyInterest < 0) {
        alert('الرجاء إدخال قيم صحيحة');
        return;
    }

    // حساب عدد الأشهر باستخدام المعادلة
    const denominator = monthlyAmount - (price * monthlyInterest);
    if (denominator <= 0) {
        // استخدام الإشعار المخصص بدلاً من alert
        showAlert();
        return;
    }

    const exactMonths = price / denominator;
    const lowerMonth = Math.floor(exactMonths);
    const upperMonth = Math.ceil(exactMonths);

    // حساب التكلفة الإجمالية للخيارين
    const lowerMonthTotal = Math.ceil(price * (1 + monthlyInterest * lowerMonth));
    const upperMonthTotal = Math.ceil(price * (1 + monthlyInterest * upperMonth));

    // حساب القسط الشهري للخيارين
    const lowerMonthPayment = Math.ceil(lowerMonthTotal / lowerMonth);
    const upperMonthPayment = Math.ceil(upperMonthTotal / upperMonth);

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    
    // التحقق مما إذا كان الخياران متساويين
    if (lowerMonth === upperMonth) {
        resultDiv.innerHTML = `
            <div class="result-grid">
                <div class="result-item">
                    <p><strong>السعر الأصلي</strong></p>
                    <p>${formatNumber(price)}</p>
                </div>
                <div class="result-item">
                    <p><strong>النتائج (${lowerMonth} أشهر)</strong></p>
                    <p>إجمالي التكلفة: ${formatNumber(lowerMonthTotal)}</p>
                    <p>القسط الشهري: ${formatNumber(lowerMonthPayment)}</p>
                    <p>إجمالي الفائدة: ${formatNumber(lowerMonthTotal - price)}</p>
                </div>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="result-grid">
                <div class="result-item">
                    <p><strong>السعر الأصلي</strong></p>
                    <p>${formatNumber(price)}</p>
                </div>
                <div class="result-item">
                    <p class="options-note"><strong>الخياران التاليان هما الأقرب إلى المبلغ الذي أدخلته</strong></p>
                </div>
                <div class="result-item">
                    <p><strong>الخيار الأول (${lowerMonth} أشهر)</strong></p>
                    <p>إجمالي التكلفة: ${formatNumber(lowerMonthTotal)}</p>
                    <p>القسط الشهري: ${formatNumber(lowerMonthPayment)}</p>
                    <p>إجمالي الفائدة: ${formatNumber(lowerMonthTotal - price)}</p>
                </div>
                <div class="result-item">
                    <p><strong>الخيار الثاني (${upperMonth} أشهر)</strong></p>
                    <p>إجمالي التكلفة: ${formatNumber(upperMonthTotal)}</p>
                    <p>القسط الشهري: ${formatNumber(upperMonthPayment)}</p>
                    <p>إجمالي الفائدة: ${formatNumber(upperMonthTotal - price)}</p>
                </div>
            </div>
        `;
    }
}

// دالة لإظهار الإشعار المخصص
function showAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'flex';
    // إضافة فئة للتحريك
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);
}

// دالة لإغلاق الإشعار المخصص
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.classList.remove('show');
    alertBox.style.display = 'none';
}