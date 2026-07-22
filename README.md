# 한판게임즈

한판게임즈는 설치 없이 바로 즐기는 무료 웹 미니게임 사이트입니다.

## Cloudflare Pages 설정

- Framework preset: None 또는 Static HTML
- Build command: `exit 0`
- Build output directory: `public`
- Production branch: `main`
- Current production domain: `https://hanpangames.kr`
- Cloudflare Pages project: `hanpan-games-git`

현재는 Cloudflare Pages와 GitHub 저장소가 연결되어 있어 `main` 브랜치 push 시 자동 배포됩니다.
다른 도메인을 사용할 경우 `tools/generate-game-pages.mjs`의 `siteUrl`, `public/sitemap.xml`, 각 HTML의 `canonical`, `robots.txt`의 도메인을 함께 교체하세요.

## 로컬 미리보기

```powershell
npx.cmd -y serve@latest public --listen 4174
```

## 운영 전 점검

- 운영 문의 이메일은 `chw1914@gmail.com`으로 안내합니다.
- 외부 스크립트는 필요한 시점에만 추가하고, 개인정보처리방침 고지를 함께 갱신하세요.
- AdSense 사이트 확인 스크립트는 전체 페이지 `<head>`에 적용되어 있습니다.
- `public/ads.txt`에는 `pub-6918910185244897` 승인 정보가 들어 있습니다.
- 게임별 상세 페이지와 가이드 글을 꾸준히 늘리면 검색 유입과 재방문에 도움이 됩니다.

## 콘텐츠 생성

```powershell
node tools\generate-editorial-guides.mjs
node tools\generate-game-pages.mjs
```

첫 번째 명령은 가이드 글과 가이드 허브를 생성하고, 두 번째 명령은 게임 상세 페이지와 sitemap.xml을 갱신합니다.
