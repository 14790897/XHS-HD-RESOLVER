<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 小红书网页版图片高清原图解析器 (XHS HD Resolver)

## 1. 项目背景与目标

用户在浏览小红书网页版时，复制的图片链接通常带有鉴权参数（`sns-webpic-qc` 域名），直接访问会报错 `403 Forbidden`，且图片为压缩版本。

本项目旨在开发一个简单的 Web 工具，用户粘贴原始"加密/压缩链接"，系统自动转换为"高清、无水印、可访问"的 PNG 格式直链。

## 2. 核心算法逻辑 (Core Logic)

这是本工具最关键的部分，请严格按照以下步骤处理字符串：

### 2.1 提取 Trace ID (文件名)

从用户输入的 URL 中提取核心文件名。

- **特征模式**：以 `1040g` 开头，直到遇到感叹号 `!` 为止（不包含感叹号）。
- **正则表达式 (Regex)**：

```regex
(1040g[^!]+)
```

**示例**：从 `.../1040g00830t2hgqelk4005o49b2u097vri7c1ij8!nd_dft...` 中提取出 `1040g00830t2hgqelk4005o49b2u097vri7c1ij8`

### 2.2 域名替换 (Domain Bypass)

原始链接通常包含 `sns-webpic-qc` (腾讯云鉴权域名)，会导致 403 错误。需将其替换为公开 CDN 域名。

**目标域名池**：

- **首选**：`https://sns-img-hw.xhscdn.com/` (华为云节点，较稳定)
- **备选**：`https://sns-img-bd.xhscdn.com/` (百度云节点)

### 2.3 参数重组 (Format Force)

为了强制获取无水印的 PNG 原图，需要在链接末尾拼接特定参数。

**后缀参数**：`?imageView2/2/w/format/png`

### 2.4 最终拼接公式

```javascript
Final_URL = Target_Domain + Trace_ID + Suffix_Parameter
```

## 3. 功能需求 (Functional Requirements)

### 3.1 输入模块

- 提供一个宽大的文本输入框
- 支持粘贴包含 `sns-webpic-qc.xhscdn.com` 的长链接
- **容错处理**：即使用户粘贴的链接带有空格或前后有多余字符，程序应尝试通过正则提取 URL

### 3.2 处理模块

- 点击"解析"按钮后，执行上述 **2. 核心算法逻辑**
- 如果未匹配到 `1040g` 开头的 ID，提示"无效的链接"

### 3.3 输出模块

- **显示直链**：在界面上显示转换后的新链接
- **图片预览**：在下方直接渲染出高清图片 (`<img>`)，方便用户确认
- **下载功能**：提供一个"下载图片"按钮（或"在新标签页打开"），点击跳转到新链接
- **自动下载开关**：默认开启，可自动下载

## 4. 测试用例 (Test Cases)

请使用以下数据测试代码的正确性：

**输入 (Input)**:

```
https://sns-webpic-qc.xhscdn.com/202511292028/30ab642bea120348cf64a607c9eb8141/1040g00830t2hgqelk4005o49b2u097vri7c1ij8!nd_dft_wlteh_webp_3
```

**预期输出 (Expected Output)**:

```
https://sns-img-hw.xhscdn.com/1040g00830t2hgqelk4005o49b2u097vri7c1ij8?imageView2/2/w/format/png
```

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

---

## Disclaimer

This tool is for educational purposes only.
