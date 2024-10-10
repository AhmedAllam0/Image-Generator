document.addEventListener('DOMContentLoaded', () => {
  // تعريف المتغيرات
  const form = document.getElementById('generate-form');
  const promptInput = document.getElementById('prompt-input');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const imageContainer = document.getElementById('image-container');
  const generatedImage = document.getElementById('generated-image');
  const downloadLink = document.getElementById('download-link');

  // مفتاح API الخاص بك
  const apiToken = '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'; // استبدل هذا بمفتاحك الحقيقي

  // إضافة مستمع الحدث للنموذج
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const prompt = promptInput.value.trim();
    if (!prompt) {
      showNotification('الرجاء إدخال وصف للصورة.', 'error');
      return;
    }

    startImageGeneration(prompt);
  });

  // وظيفة بدء توليد الصورة
  function startImageGeneration(prompt) {
  progressBar.style.width = '0%';
  progressText.textContent = 'جارٍ توليد الصورة...';
  document.getElementById('generation-progress').style.display = 'block';
  imageContainer.style.display = 'none';

  // عرض إشعار للمستخدم بأن المعالجة بدأت
  showNotification('جاري توليد الصورة، يرجى الانتظار...', 'info');
    // إرسال طلب إلى API
    fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status);
      }
      return response.blob();
    })
    .then(blob => {
      progressBar.style.width = '100%';
      progressText.textContent = 'اكتمل توليد الصورة 100%';

      const imageUrl = URL.createObjectURL(blob);
      generatedImage.src = imageUrl;
      downloadLink.href = imageUrl; // Set the href for download
      imageContainer.style.display = 'block';

      showNotification('تم إنشاء الصورة بنجاح!');
    })
    .catch(error => {
      console.error('Error generating image:', error);
      showNotification('حدث خطأ أثناء توليد الصورة. الرجاء المحاولة مرة أخرى.', 'error');
      progressBar.style.width = '0%';
      progressText.textContent = 'حدث خطأ.';
    });

    // تحديث شريط التقدم بشكل دوري
    let progress = 0;
const interval = setInterval(() => {
  if (progress < 100) {
    progress += 10; // زيادة التقدم
    progressBar.style.width = `${progress}%`;
  } else {
    clearInterval(interval);
  }
}, 1000); // تحديث كل ثانية
  }
  // وظيفة عرض الإشعارات
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});
