# 한판게임즈

한판게임즈는 설치 없이 바로 즐기는 무료 웹 미니게임 사이트입니다.

## Cloudflare Pages 설정

- Framework preset: None 또는 Static HTML
- Build command: `exit 0`
- Build output directory: `public`
- Production branch: `main`
- Custom domain recommendation: `hanpan.tali.kr`

Cloudflare Pages에서 GitHub 저장소를 연결하면 `main` 브랜치에 push할 때마다 자동 배포됩니다.
Git 연동으로 운영할 예정이면 Wrangler Direct Upload 배포는 먼저 하지 마세요. GitHub 저장소를 연결한 Pages 프로젝트로 시작하는 것이 깔끔합니다.
다른 도메인을 사용할 경우 `public/sitemap.xml`, 각 HTML의 `canonical`, `robots.txt`의 도메인을 함께 교체하세요.

## 로컬 미리보기

```powershell
npx.cmd -y serve@latest public --listen 4174
```

## AdSense 준비 체크리스트

- 실제 운영 이메일로 `contact@tali.kr` 표기를 교체하세요.
- 승인 전에는 광고 스크립트를 넣지 않는 편이 안전합니다.
- 승인 후 Google AdSense에서 발급한 `ads.txt` 한 줄을 사이트 루트에 추가하세요.
- 게임별 상세 페이지와 가이드 글을 꾸준히 늘리면 심사와 검색 유입에 유리합니다.
