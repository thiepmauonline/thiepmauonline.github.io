/**
 * CONTACT MODAL LOGIC
 * Tự động tải HTML modal và xử lý gửi thông tin lên Telegram.
 */

// Lấy thẻ script hiện tại để xác định đường dẫn gốc (giải quyết vấn đề đường dẫn tương đối)
const currentScript = document.currentScript;
const scriptSrc = currentScript.src;
// Đường dẫn base (cắt bỏ /assets/js/contact-modal.js)
const rootUrl = scriptSrc.substring(0, scriptSrc.indexOf('/assets/js/contact-modal.js'));

//==============================================
// CẤU HÌNH BOT TELEGRAM (BẠN HÃY THAY ĐỔI Ở ĐÂY)
//==============================================
const BOT_TOKEN = "8629553146:AAGWMfZ9DkT2jJQ8uQVg9S80J1JXql27wvw";
const CHAT_ID = "7024613648";
//==============================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tải file HTML của modal và chèn vào cuối thẻ <body>
  fetch(`${rootUrl}/contact-modal.html`)
    .then(response => {
      if (!response.ok) throw new Error("Không thể tải file contact-modal.html");
      return response.text();
    })
    .then(html => {
      // Tạo một div bọc để chứa HTML tải về
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Khởi tạo các sự kiện sau khi HTML đã được nạp vào DOM
      initContactModal();
    })
    .catch(error => console.error("Lỗi khi load Contact Modal:", error));
});

function initContactModal() {
  const contactForm = document.getElementById("contactForm");
  const customerName = document.getElementById("customerName");
  const customerZalo = document.getElementById("customerZalo");
  const customerFb = document.getElementById("customerFb");
  const btnSubmit = document.getElementById("btnSubmitContact");
  const alertContainer = document.getElementById("contactAlertContainer");

  if (!contactForm) return;

  // Regex kiểm tra số điện thoại VN: Bắt đầu bằng 0 hoặc +84, theo sau là 9 số hợp lệ
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

  // Hàm hiển thị thông báo Alert (xanh/đỏ)
  const showAlert = (message, type = "success") => {
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="border-radius: 8px; font-size: 0.95rem;">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  };

  // Lắng nghe sự kiện Submit form
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Ngăn trình duyệt reload trang
    
    // Xóa alert cũ
    alertContainer.innerHTML = "";
    
    let isValid = true;

    // Validate 1: Họ tên không được để trống
    const nameVal = customerName.value.trim();
    if (nameVal === "") {
      customerName.classList.add("is-invalid");
      isValid = false;
    } else {
      customerName.classList.remove("is-invalid");
    }

    // Validate 2: Zalo phải đúng định dạng số VN
    const zaloVal = customerZalo.value.trim();
    if (!phoneRegex.test(zaloVal)) {
      customerZalo.classList.add("is-invalid");
      isValid = false;
    } else {
      customerZalo.classList.remove("is-invalid");
    }

    // Nếu không hợp lệ thì dừng lại
    if (!isValid) return;

    // Gửi thông tin (API Call)
    try {
      // 1. Chuyển nút bấm sang trạng thái loading
      const originalBtnHtml = btnSubmit.innerHTML;
      btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang gửi...`;
      btnSubmit.classList.add("btn-loading");

      // 2. Lấy tên mẫu từ document.title
      // Loại bỏ hậu tố " | Happy Card" hoặc các kí tự thừa nếu có
      let templateName = document.title.split(" | ")[0].trim();

      // 3. Lấy thời gian hiện tại
      const timeString = new Date().toLocaleString("vi-VN");

      // 4. Định dạng tin nhắn gửi đi
      const messageText = `
📩 <b>KHÁCH HÀNG MỚI ĐĂNG KÝ</b>

🎨 <b>Mẫu:</b> ${templateName}

👤 <b>Họ tên:</b> ${nameVal}
📱 <b>Zalo:</b> ${zaloVal}
🔗 <b>Facebook:</b> ${customerFb.value.trim() || "Không có"}

🕒 <b>Thời gian:</b> ${timeString}
      `;

      // 5. Cấu hình Telegram API
      // Bỏ qua gửi thực tế nếu chưa điền TOKEN để tránh báo lỗi trên console người dùng.
      if (BOT_TOKEN === "YOUR_BOT_TOKEN" || CHAT_ID === "YOUR_CHAT_ID") {
        console.warn("⚠️ Cảnh báo: Vui lòng cấu hình BOT_TOKEN và CHAT_ID trong contact-modal.js để gửi tới Telegram. Dữ liệu giả lập thành công.");
        
        // Cố tình tạo độ trễ giả lập mạng
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showAlert("Cảm ơn bạn. Happy Card sẽ liên hệ với bạn trong thời gian sớm nhất.", "success");
        contactForm.reset();
        
        // Khôi phục nút
        btnSubmit.innerHTML = originalBtnHtml;
        btnSubmit.classList.remove("btn-loading");
        return;
      }

      const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: messageText,
          parse_mode: "HTML" // Hỗ trợ in đậm
        }),
      });

      if (response.ok) {
        // Thành công
        showAlert("Cảm ơn bạn. Happy Card sẽ liên hệ với bạn trong thời gian sớm nhất.", "success");
        contactForm.reset();
      } else {
        // Lỗi từ phía API Telegram
        const errorData = await response.json();
        console.error("Lỗi Telegram:", errorData);
        showAlert("Có lỗi xảy ra khi gửi thông tin (Telegram API). Vui lòng thử lại sau.", "danger");
      }

    } catch (error) {
      // Lỗi mạng hoặc block
      console.error("Lỗi kết nối:", error);
      showAlert("Không thể kết nối. Vui lòng kiểm tra lại mạng của bạn.", "danger");
    } finally {
      // Khôi phục trạng thái nút bấm
      btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane me-2"></i> Gửi thông tin`;
      btnSubmit.classList.remove("btn-loading");
    }
  });

  // Tự động xóa báo lỗi đỏ khi người dùng bắt đầu gõ lại
  customerName.addEventListener("input", () => customerName.classList.remove("is-invalid"));
  customerZalo.addEventListener("input", () => customerZalo.classList.remove("is-invalid"));
}
