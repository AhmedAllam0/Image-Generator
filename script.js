// تعريف مفتاح API (استبدله بمفتاح API الخاص بك من Hugging Face)
const API_TOKEN = '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';

// تعريف العناصر من DOM
const imageGenerateButton = document.getElementById('generate-button');
const imagePromptInput = document.getElementById('prompt-input');
const imageModelSelector = document.getElementById('image-model-selector');
const imageOutput = document.getElementById('image-output');
const generatedImage = document.getElementById('generated-image');
const downloadLink = document.getElementById('download-link');

// حدث عند النقر على زر توليد الصورة
imageGenerateButton.addEventListener('click', () => {
  const prompt = imagePromptInput.value.trim();
  const modelId = imageModelSelector.value;

  if (!prompt) {
    alert('الرجاء إدخال وصف للصورة.');
    return;
  }

  generateImage(prompt, modelId);
});

function generateImage(prompt, modelId) {
  // إخفاء العنصر الذي يحتوي على الصورة والإعدادات
  imageOutput.style.display = 'none';
  imageGenerateButton.disabled = true;
  imageGenerateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإنشاء...';

  // إرسال الطلب إلى واجهة برمجة تطبيقات Hugging Face
  fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`, // تأكد من تعريف API_TOKEN بمفتاح API الخاص بك
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      options: { wait_for_model: true } // الانتظار حتى يكون النموذج جاهزًا
    })
  })
    .then(response => {
      if (!response.ok) {
        // إذا كانت الاستجابة غير ناجحة، استخراج رسالة الخطأ
        return response.json().then(errorData => {
          throw new Error(`خطأ في الاستجابة من الخادم: ${response.status} - ${errorData.error}`);
        });
      }
      // إذا كانت الاستجابة ناجحة، تحويلها إلى Blob
      return response.blob();
    })
    .then(blob => {
      // إنشاء رابط URL للصورة المستلمة وعرضها
      const imageUrl = URL.createObjectURL(blob);
      generatedImage.src = imageUrl;
      downloadLink.href = imageUrl;
      imageOutput.style.display = 'block';
    })
    .catch(error => {
      console.error('خطأ أثناء توليد الصورة:', error);
      alert(`حدث خطأ أثناء توليد الصورة: ${error.message}`);
    })
    .finally(() => {
      // إعادة تفعيل زر الإنشاء بعد الانتهاء
      imageGenerateButton.disabled = false;
      imageGenerateButton.innerHTML = '<i class="fas fa-magic"></i> إنشاء الصورة';
    });
}
