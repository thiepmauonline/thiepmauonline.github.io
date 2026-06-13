import os
import glob
import re

templates = glob.glob('/home/hanh-dinh/Downloads/Project/haapy-card/templates/*/index.html')

html_template = """<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>__TITLE__ - Happy Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/css/app.css">
  <link rel="stylesheet" href="../../assets/css/animation.css">
  
  <script>
    // JSON config cho hình ảnh. Bạn có thể thêm link ảnh vào đây.
    // Nếu để trống (""), khối nền đen sẽ hiển thị.
    const PAGE_IMAGES = {
      "img1": "",
      "img2": "",
      "img3": ""
    };
  </script>
</head>
<body class="template-shell mobile-mode">
  <div class="mobile-app-container __THEME__">
    <header class="topbar">
      <div class="container-wide">
        <div class="nav-shell position-relative" style="justify-content:center;">
          <strong class="text-white ms-2">__SHORT_TITLE__</strong>
        </div>
      </div>
    </header>

    <main class="container-wide pb-5">
      <div class="text-center mt-4 mb-4" data-aos="fade-down">
        <h1 class="display-title" style="font-size: 2.2rem; color: #fff;">__HEADING__</h1>
        <p class="text-white-soft mt-2">__DESC__</p>
      </div>

      <div class="images-container mt-4" data-aos="fade-up">
        <!-- Render images dynamically here -->
        <div class="dynamic-img" data-img="img1"></div>
        <div class="dynamic-img" data-img="img2"></div>
        <div class="dynamic-img" data-img="img3"></div>
      </div>

      <div class="story-card mt-4" data-aos="fade-up">
        <span class="kicker mb-3">Lời chúc</span>
        <h3 style="font-size: 1.2rem;">__WISH_HEADING__</h3>
        <p class="mb-0" style="font-size: 0.95rem;">__WISH_DESC__</p>
      </div>
      
      <div class="text-center mt-5 mb-3">
        <a class="btn-card secondary" href="../../index.html" style="font-size: 0.9rem; min-height: 44px;">
           <i class="fa-solid fa-arrow-left"></i> Quay lại
        </a>
      </div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
  <script src="../../assets/js/app.js"></script>
  
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll(".dynamic-img").forEach(container => {
        const key = container.getAttribute("data-img");
        const src = PAGE_IMAGES[key];
        
        if (src && src.trim() !== "") {
          container.innerHTML = `<div class="image-block"><img src="${src}" alt="Ảnh chi tiết"></div>`;
        } else {
          container.innerHTML = `<div class="image-block img-placeholder"><span>Chưa có ảnh (${key})</span></div>`;
        }
      });
    });
  </script>
</body>
</html>
"""

themes = {
    'birthday-01': ('Birthday 01', 'Birthday', 'theme-birthday-01', 'Chúc mừng sinh nhật!', 'Một ngày thật tuyệt vời.', 'Gửi ngàn lời chúc', 'Chúc bạn một tuổi mới tràn ngập niềm vui.'),
    'birthday-02': ('Birthday 02', 'Birthday', 'theme-birthday-02', 'Happy Birthday', 'Tuổi mới rực rỡ.', 'Lời chúc tốt đẹp nhất', 'Mong mọi điều tốt lành đến với bạn.'),
    'love-01': ('Love 01', 'Love', 'theme-love-01', 'I Love You', 'Gửi trọn tình yêu.', 'Tình yêu của anh', 'Mãi yêu em.'),
    'newyear-01': ('New Year 01', 'New Year', 'theme-newyear-01', 'Happy New Year!', 'Năm mới bình an.', 'Lời chúc năm mới', 'An khang thịnh vượng.'),
    'wedding-01': ('Wedding 01', 'Wedding', 'theme-wedding-01', 'Happy Wedding', 'Trăm năm hạnh phúc.', 'Lời chúc cưới', 'Chúc hai bạn mãi bên nhau.')
}

for path in templates:
    folder = os.path.basename(os.path.dirname(path))
    if folder in themes:
        title, short_title, theme, heading, desc, wish_heading, wish_desc = themes[folder]
        content = html_template.replace('__TITLE__', title).replace('__SHORT_TITLE__', short_title).replace('__THEME__', theme).replace('__HEADING__', heading).replace('__DESC__', desc).replace('__WISH_HEADING__', wish_heading).replace('__WISH_DESC__', wish_desc)
        with open(path, 'w') as f:
            f.write(content)
print("Updated all templates")
