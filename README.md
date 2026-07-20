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
- 광고 서비스를 적용할 때는 발급받은 `ads.txt` 한 줄을 사이트 루트에 추가하세요.
- 게임별 상세 페이지와 가이드 글을 꾸준히 늘리면 검색 유입과 재방문에 도움이 됩니다.
