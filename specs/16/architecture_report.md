Architecture Report — PBI 16

Tóm tắt ngắn (<= 250 từ):

Kế hoạch chuyển renderer từ Element Plus sang Ant Design Vue giữ nguyên backend và schema dữ liệu. Giải pháp giới thiệu một lớp UI adapter gồm wrappers cho Button, Table, Form và một theme bridge để map SCSS tokens hiện tại sang Ant Design variables (Less). Việc migrate thực hiện theo pha: chuẩn bị môi trường (less, vite), xây dựng wrappers và plugin đăng ký, chuyển layout và các trang ưu tiên, rồi QA và loại bỏ Element Plus. Các rủi ro chính là the ming differences và build-tooling (Less). Đề xuất: migrate theo từng trang, giữ Element Plus trong repo cho đến khi QA hoàn tất, và có một sprint dành cho theme/token tuning. Team: Frontend chịu phần lớn công việc; DevOps hỗ trợ cấu hình Vite/CI; QA kiểm thử manual cho các luồng chính.
