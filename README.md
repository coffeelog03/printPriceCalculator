# PrintPro - Công cụ tính giá in

Đây là một ứng dụng web được xây dựng bằng Next.js, được thiết kế để giúp các cửa hàng in ấn và photocopy nhanh chóng và dễ dàng tạo báo giá cho khách hàng.

## Chức năng chính

- **Tính giá động:** Tự động tính toán chi phí cho các sản phẩm in ấn khác nhau dựa trên các tùy chọn cấu hình của người dùng.
- **Nhiều loại sản phẩm:** Hỗ trợ ba loại sản phẩm chính:
    - **In tài liệu:** Với các tùy chọn về loại giấy, kiểu in (trắng đen/màu), in hai mặt, khổ giấy và các hình thức đóng cuốn (bấm kim, keo nhiệt).
    - **In hóa đơn:** Hỗ trợ giấy thường và giấy carbonless, với nhiều kích thước và màu mực khác nhau.
    - **In decal:** Hỗ trợ decal giấy và decal nhựa, với các tùy chọn về cán màng, cắt bế, và cán foam.
- **Tóm tắt đơn hàng trực tiếp:** Cung cấp một bảng tóm tắt đơn hàng rõ ràng, hiển thị chi tiết tên sản phẩm, số lượng, đơn giá và thành tiền, cập nhật theo thời gian thực.
- **Quản lý báo giá:**
    - Thêm, xóa, và nhân bản các sản phẩm trong báo giá.
    - Nhập thông tin khách hàng (tên và số điện thoại).
    - **Xuất/Nhập báo giá:** Lưu lại báo giá dưới dạng tệp JSON và tải lại khi cần.
    - **Lưu dưới dạng ảnh:** Chụp lại bảng tóm tắt đơn hàng và lưu dưới dạng tệp ảnh `.jpg` để dễ dàng gửi cho khách hàng.
- **Giao diện hiện đại:** Giao diện người dùng được xây dựng bằng các thành phần của ShadCN UI và Tailwind CSS, đảm bảo tính thẩm mỹ và dễ sử dụng.

## Bắt đầu

Để chạy ứng dụng trên máy của bạn, hãy làm theo các bước sau:

1.  **Cài đặt các gói phụ thuộc:**
    ```bash
    npm install
    ```

2.  **Chạy máy chủ phát triển:**
    ```bash
    npm run dev
    ```

3.  Mở trình duyệt của bạn và truy cập vào [http://localhost:9002](http://localhost:9002).

## Công nghệ sử dụng

-   **Framework:** Next.js (với App Router)
-   **Ngôn ngữ:** TypeScript
-   **UI:** React, ShadCN UI
-   **Styling:** Tailwind CSS
-   **Form:** React Hook Form
-   **Dependencies khác:** `html-to-image` để xuất ảnh, `lucide-react` cho icons.
