# 한판게임

한판게임은 설치 없이 바로 즐기는 무료 웹 미니게임 사이트입니다.

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
node tools\dev-server.mjs
```

기본 주소는 `http://127.0.0.1:4173`입니다.

## 운영 전 점검

- 운영 문의 이메일은 `chw1914@gmail.com`으로 안내합니다.
- 외부 스크립트는 필요한 시점에만 추가하고, 개인정보처리방침 고지를 함께 갱신하세요.
- AdSense 사이트 확인 스크립트는 품질 검토를 마친 색인 대상 페이지의 `<head>`에만 적용합니다.
- 보강 대기 페이지는 계속 플레이할 수 있지만 `noindex, follow`로 두고 광고를 표시하지 않습니다.
- `public/ads.txt`에는 `pub-6918910185244897` 승인 정보가 들어 있습니다.
- 새 페이지 수보다 각 게임의 완성도, 고유 설명, 모바일 조작과 오류 없는 플레이를 우선합니다.

## 콘텐츠 생성

```powershell
node tools\generate-editorial-guides.mjs
node tools\generate-game-pages.mjs
node tools\prepare-adsense-review.mjs
```

첫 번째 명령은 가이드 글과 가이드 허브를 생성하고, 두 번째 명령은 게임 상세 페이지를 갱신합니다. 마지막 명령은 대표 콘텐츠 탐색 구조, 색인·광고 정책, sitemap.xml과 품질 감사 보고서를 다시 적용합니다.
