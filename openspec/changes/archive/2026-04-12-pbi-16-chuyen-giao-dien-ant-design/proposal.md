# Proposal: Chuyển giao diện về Ant Design

## Tên thay đổi
16-chuyen-giao-dien-ant-design

## Mục tiêu
Chuyển giao diện renderer của ứng dụng từ Element Plus sang Ant Design Vue (ant-design-vue). Giữ nguyên hành vi nghiệp vụ, nâng cao nhất quán giao diện, tận dụng component library có bộ component phong phú và hệ sinh thái tốt.

## Tại sao
- Element Plus đang được dùng nhưng team muốn thống nhất về Ant Design (thiết kế, các component nâng cao, hơn nhiều plugin/ico). 
- Ant Design Vue: nhiều component, theme khả năng tùy biến, cộng đồng lớn.
- Migration qua Sora UI wrappers giúp cô lập thay đổi và giảm blast radius.

## Phạm vi
- Thay thế Element Plus ở frontend (renderer Vue 3).  
- Tạo plugin Ant Design Vue và các Sora UI wrappers (Button, Input, Select, Modal, Form, Table, Layout, Icon wrapper, …).  
- Chuyển CSS variables và mapping theme từ _variables.scss sang biến tương ứng cho Ant Design.

## Ngoại trừ (out-of-scope)
- Thiết lại UX hoặc UX copy beyond component parity.
- Backend, database, main process changes.

## Thành công
- Ứng dụng build & chạy, toàn bộ màn chính (layouts, transactions list, form thêm giao dịch) hoạt động như trước.  
- All Element Plus imports removed and replaced by wrappers or ant-design-vue components.  

## Rủi ro & mitigation
- Rủi ro: thay đổi style gây regressions — mitigation: incremental migration theo vùng (layouts → pages → components) và chạy manual QA checklist.  
- Rủi ro: breaking API của component (props/events) — mitigation: tạo wrappers với prop mapping.

## Branch & artefact
- Thực hiện trên branch hiện tại: feature/16-chuyen-giao-dien-ant-design (branch đã tồn tại).  
- Artefacts tạo: design.md, tasks.md (nằm trong openspec/changes/16-chuyen-giao-dien-ant-design/).
