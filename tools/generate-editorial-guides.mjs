import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const siteUrl = "https://hanpangames.kr";
const assetVersion = "20260720-depth";
const publishedDate = "2026-07-22";
const adsenseClient = "ca-pub-6918910185244897";
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}" crossorigin="anonymous"></script>`;
const searchConsoleVerification = `<meta name="google-site-verification" content="qBlRPhDg3Tazy0wuTNee_wfGeDjuYz80N6R_Iinh9bs" />`;

const guides = [
  {
    id: "short-break-web-games",
    category: "게임 선택",
    title: "짧은 휴식 시간에 하기 좋은 무료 웹게임 고르는 법",
    description: "설치 없이 바로 시작하는 무료 웹게임을 고를 때 확인하면 좋은 기준을 플레이 시간, 조작 난이도, 기록 방식, 모바일 환경 중심으로 정리했습니다.",
    summary: "쉬는 시간이 짧을수록 게임은 더 단순해야 하지만, 단순하다는 말이 얕다는 뜻은 아닙니다. 한 판의 목표가 분명하고 바로 다시 도전할 이유가 있으면 짧은 웹게임도 충분히 오래 즐길 수 있습니다.",
    readingTime: "5분",
    relatedGames: [
      { title: "반응속도 체크", href: "/games/reaction-speed/", text: "짧은 집중 상태 확인" },
      { title: "기억 타일", href: "/games/memory-tiles/", text: "가벼운 두뇌 전환" },
      { title: "버블팝", href: "/games/bubble-pop/", text: "부담 없는 터치 플레이" }
    ],
    sections: [
      {
        heading: "첫 기준은 한 판의 길이입니다",
        paragraphs: [
          "짧은 휴식 시간에 어울리는 게임은 시작 전에 준비할 것이 적고, 실패해도 바로 다시 해볼 수 있어야 합니다. 설명을 오래 읽어야 하거나 첫 판이 너무 길면 휴식보다 과제가 되는 느낌이 커집니다. 30초에서 3분 사이에 한 판이 끝나는 게임은 업무나 공부 사이에 끼워 넣기 좋습니다.",
          "반응속도, 클릭, 목표 누르기처럼 즉시 결과가 나오는 게임은 머리를 비우는 데 좋고, 숫자 추리나 기억 타일처럼 짧게 생각하는 게임은 집중을 다시 켜는 데 좋습니다. 목적이 다르기 때문에 점수만 보고 좋은 게임을 고르기보다 지금 필요한 휴식의 성격을 먼저 정하는 편이 좋습니다."
        ]
      },
      {
        heading: "조작은 한 손으로도 이해되어야 합니다",
        paragraphs: [
          "브라우저 미니게임은 키보드, 마우스, 터치가 모두 자연스럽게 이어져야 합니다. 특히 모바일에서는 화면을 가리는 손의 위치가 곧 난이도가 됩니다. 버튼이 작거나 게임판과 조작부가 너무 붙어 있으면 실수 클릭이 늘고, 실수 클릭은 게임의 재미보다 불편함을 먼저 남깁니다.",
          "좋은 짧은 게임은 조작이 단순하되 입력 결과가 즉시 보입니다. 누른 순간 표적이 사라지거나, 블록이 이동하거나, 기록이 갱신되는 식의 반응이 있어야 합니다. 이런 즉각적인 피드백은 사용자가 규칙을 따로 외우지 않아도 스스로 배우게 만듭니다."
        ]
      },
      {
        heading: "기록은 비교보다 재도전을 부르는 방식이 좋습니다",
        paragraphs: [
          "최고 기록은 강력한 동기지만, 한 번 좋은 기록이 나온 뒤에는 오히려 부담이 될 수 있습니다. 그래서 짧은 게임에서는 최고 기록과 최근 기록, 시도 횟수처럼 여러 기준이 같이 있으면 좋습니다. 오늘 컨디션을 보는 게임인지, 장기적으로 실력을 쌓는 게임인지에 따라 기록의 의미도 달라집니다.",
          "한판게임즈는 가능한 한 브라우저 안에서만 기록을 다루는 방향을 유지합니다. 별도 계정 없이도 내 기기에서 바로 기록을 볼 수 있고, 언제든 다시 시작할 수 있는 구조가 짧은 게임의 장점과 잘 맞기 때문입니다."
        ]
      },
      {
        heading: "게임 선택은 컨디션에 맞추면 오래 갑니다",
        paragraphs: [
          "눈이 피곤한 날에는 빠른 표적 게임보다 보드나 숫자 추리 게임이 편할 수 있습니다. 손이 굳은 날에는 벽돌깨기나 퐁처럼 리듬을 타는 게임이 좋고, 머리를 잠깐 깨우고 싶을 때는 스도쿠 미니나 2048처럼 다음 수를 보는 게임이 어울립니다.",
          "하루에 여러 게임을 오래 붙잡기보다 하나를 짧게 고르고, 결과를 확인한 뒤 멈출 수 있어야 좋은 휴식이 됩니다. 재미있는 게임일수록 다시 시작 버튼이 가까운 만큼, 그만둘 타이밍도 스스로 정해두면 더 편하게 즐길 수 있습니다."
        ]
      },
      {
        heading: "추천 루틴은 한 장르를 오래 붙잡지 않는 것입니다",
        paragraphs: [
          "짧은 게임을 여러 개 즐길 때는 같은 장르를 계속 반복하기보다 반응형, 퍼즐형, 리듬형을 번갈아 해보는 편이 피로가 덜합니다. 예를 들어 반응속도 체크로 손을 풀고, 기억 타일로 시선을 안정시키고, 마지막에 벽돌깨기처럼 움직임이 있는 게임을 한 판 하는 식입니다.",
          "이렇게 장르를 바꾸면 기록이 잘 나오지 않는 날에도 사이트 경험이 단조롭게 느껴지지 않습니다. 또한 어떤 게임에서 실수가 늘어나는지 비교할 수 있어, 단순한 시간 보내기를 넘어 내 컨디션을 가볍게 확인하는 도구처럼 사용할 수 있습니다."
        ]
      }
    ],
    checklist: [
      "첫 판이 3분 안에 끝나는지 확인합니다.",
      "키보드와 터치 조작이 모두 이해하기 쉬운지 봅니다.",
      "최고 기록 외에 최근 기록이나 진행 상태를 확인합니다.",
      "지금 필요한 휴식이 반응형인지, 퍼즐형인지, 리듬형인지 먼저 고릅니다."
    ]
  },
  {
    id: "brick-break-strategy",
    category: "아케이드 공략",
    title: "벽돌깨기 초보 공략: 패들 위치와 반사각 이해하기",
    description: "벽돌깨기에서 공을 오래 살리고 점수를 안정적으로 올리기 위한 패들 위치, 반사각, 위험 상황 대처법을 정리했습니다.",
    summary: "벽돌깨기는 공만 따라가면 금방 바빠집니다. 공이 내려오기 전에 도착 지점을 예측하고, 패들의 어느 부분에 맞힐지 생각하면 같은 규칙에서도 훨씬 깊은 플레이가 됩니다.",
    readingTime: "6분",
    relatedGames: [
      { title: "벽돌깨기 미니", href: "/games/brick-break/", text: "공 반사와 레벨 클리어" },
      { title: "퐁 랠리", href: "/games/pong-rally/", text: "패들 반사각 연습" },
      { title: "우주 방어선", href: "/games/space-guard/", text: "아케이드 집중력 전환" }
    ],
    sections: [
      {
        heading: "공의 현재 위치보다 다음 도착점을 봅니다",
        paragraphs: [
          "초보자가 가장 많이 하는 실수는 공이 내려오는 순간에만 반응하는 것입니다. 공이 벽이나 벽돌에 맞는 순간 이미 다음 궤적이 정해지므로, 공을 끝까지 따라가기보다 내려올 위치를 먼저 예상해야 합니다. 이 습관 하나만으로 패들이 늦게 움직이는 상황이 크게 줄어듭니다.",
          "처음에는 패들을 크게 움직이지 않는 편이 좋습니다. 공이 빠르게 보이면 손이 과하게 움직이고, 그 결과 패들이 목표 지점을 지나쳐 버립니다. 가운데에서 시작해 필요한 만큼만 이동하는 방식이 안정적입니다."
        ]
      },
      {
        heading: "패들의 가운데와 가장자리는 다른 선택입니다",
        paragraphs: [
          "패들 가운데에 공을 맞히면 반사각이 안정적이고, 가장자리에 맞히면 공이 더 날카롭게 꺾입니다. 가운데 반사는 생존에 좋고, 가장자리 반사는 벽돌이 남은 구석을 파고들 때 좋습니다. 점수를 올리려면 두 반사를 구분해서 써야 합니다.",
          "공이 빨라질수록 공격적인 각도는 위험해집니다. 아직 목숨이나 여유가 부족하다면 가장자리 반사보다 중앙 반사로 흐름을 늦추고, 남은 벽돌의 배치를 다시 보는 편이 낫습니다. 잘하는 플레이는 항상 빠른 플레이가 아니라 상황에 맞는 플레이입니다."
        ]
      },
      {
        heading: "구석 벽돌은 일부러 각도를 만들어야 합니다",
        paragraphs: [
          "마지막에 남는 벽돌은 대개 구석이나 벽 가까이에 있습니다. 공이 같은 길만 반복하면 남은 벽돌을 건드리지 못해 시간이 길어집니다. 이때는 패들의 바깥쪽으로 공을 받아 각도를 바꾸고, 벽을 타고 들어가는 궤적을 만드는 것이 좋습니다.",
          "다만 각도를 바꾼 직후가 가장 위험합니다. 공이 예상보다 빠르게 되돌아올 수 있으므로, 공을 보낸 뒤에는 패들을 가운데 쪽으로 복귀시켜 다음 수비 위치를 확보해야 합니다."
        ]
      },
      {
        heading: "모바일에서는 손가락이 가리는 영역을 줄입니다",
        paragraphs: [
          "터치 환경에서는 손가락이 패들과 공 사이를 가리기 쉽습니다. 패들을 직접 덮듯이 움직이기보다 화면 아래쪽에서 짧게 끌어 이동하면 공의 움직임을 더 잘 볼 수 있습니다. 게임판 전체를 보려면 손가락을 화면 중앙까지 올리지 않는 것이 좋습니다.",
          "짧은 아케이드 게임은 실패 후 바로 다시 시작하는 흐름이 중요합니다. 공을 놓쳤다면 마지막 순간에 패들이 늦었는지, 각도가 너무 컸는지, 공을 보낸 뒤 복귀가 늦었는지를 한 가지만 확인하고 다음 판으로 넘어가면 충분합니다."
        ]
      },
      {
        heading: "초보 연습은 세 판 단위가 적당합니다",
        paragraphs: [
          "벽돌깨기는 한 판만으로 감각을 판단하기 어렵습니다. 첫 판은 공 속도와 패들 이동을 익히고, 두 번째 판은 일부러 중앙 반사를 많이 사용해 안정감을 확인하고, 세 번째 판에서 구석 벽돌을 노리는 식으로 목표를 나누면 좋습니다.",
          "세 판을 마친 뒤에는 점수보다 공을 놓친 장면을 떠올려 보세요. 공이 너무 빠르게 꺾였는지, 패들이 지나쳤는지, 마지막 벽돌에 집착해 중앙 복귀가 늦었는지 확인하면 다음 플레이의 개선점이 분명해집니다. 이런 짧은 복기가 고전 아케이드의 재미를 더 오래 살립니다.",
          "기록이 어느 정도 안정되면 일부러 다른 각도를 시도해보는 것도 좋습니다. 항상 같은 방식으로만 공을 받으면 안전하지만 남은 벽돌 처리 능력이 늘지 않습니다. 실패 위험이 낮은 초반에 여러 반사각을 경험해두면 후반에 선택지가 많아집니다."
        ]
      }
    ],
    checklist: [
      "공이 벽에 맞은 직후 다음 도착 지점을 먼저 예측합니다.",
      "초반에는 패들 중앙 반사로 속도를 읽습니다.",
      "남은 벽돌이 구석에 있을 때만 가장자리 반사를 적극 사용합니다.",
      "모바일에서는 손가락이 공을 가리지 않도록 아래쪽 조작을 유지합니다."
    ]
  },
  {
    id: "block-drop-beginner",
    category: "퍼즐 공략",
    title: "블록 드롭 클래식 초보 가이드: 빈칸을 줄이는 배치법",
    description: "블록 드롭 클래식에서 초보자가 오래 버티기 위해 알아야 할 바닥 정리, 빈칸 방지, 다음 블록 읽기, 위기 대처법을 설명합니다.",
    summary: "낙하 퍼즐은 빨리 내리는 게임처럼 보이지만, 실제 핵심은 나중에 지울 수 없는 빈칸을 만들지 않는 것입니다. 보드를 낮게 유지하면 속도가 올라가도 선택지가 남습니다.",
    readingTime: "6분",
    relatedGames: [
      { title: "블록 드롭 클래식", href: "/games/block-drop-classic/", text: "낙하 퍼즐 기본기" },
      { title: "블록 채우기", href: "/games/block-fill/", text: "공간 배치 연습" },
      { title: "2048", href: "/games/twenty-48/", text: "다음 수 예측 훈련" }
    ],
    sections: [
      {
        heading: "가장 중요한 목표는 보드 높이를 낮게 유지하는 것입니다",
        paragraphs: [
          "블록 드롭에서 초보자가 점수를 잃는 순간은 대개 한 줄을 못 지워서가 아니라, 지울 수 없는 빈칸이 쌓였을 때입니다. 빈칸 위에 블록이 올라가면 나중에 그 줄을 정리하기가 어려워지고, 보드는 갑자기 높아집니다. 그래서 초반에는 멋진 연속 삭제보다 평평한 바닥을 만드는 것이 더 중요합니다.",
          "보드가 낮으면 실수할 공간이 남습니다. 반대로 보드가 높으면 좋은 블록이 와도 놓을 곳이 제한됩니다. 낙하 속도가 느린 초반부터 낮은 보드를 유지하는 습관을 만들면 후반에도 급하게 판단하는 상황이 줄어듭니다."
        ]
      },
      {
        heading: "긴 블록을 기다리는 통로는 한쪽에만 남깁니다",
        paragraphs: [
          "많은 플레이어가 네 줄 삭제를 노리기 위해 긴 세로 통로를 남깁니다. 이 전략은 좋지만, 통로가 여러 곳으로 흩어지면 오히려 보드가 불안정해집니다. 한쪽 끝에만 통로를 두고 나머지 칸은 낮게 정리하는 편이 안정적입니다.",
          "긴 블록이 늦게 나올 수 있다는 점도 고려해야 합니다. 통로 옆이 너무 높아지면 긴 블록이 오기 전에 게임이 끝날 수 있습니다. 통로를 유지하되, 당장 위험한 높이를 낮추는 선택을 우선하는 것이 초보자에게 더 좋습니다."
        ]
      },
      {
        heading: "다음 블록을 보고 현재 블록을 놓습니다",
        paragraphs: [
          "낙하 퍼즐의 깊이는 현재 블록 하나가 아니라 다음 블록과의 연결에서 나옵니다. 현재 블록이 딱 맞는 자리라도 다음 블록을 놓을 곳이 사라진다면 좋은 선택이 아닐 수 있습니다. 한 수 뒤만 봐도 빈칸과 높은 탑을 크게 줄일 수 있습니다.",
          "예를 들어 납작한 블록이 다음에 온다면 바닥을 넓게 만들고, 네모 블록이 다음에 온다면 2칸짜리 평평한 자리를 남기는 식으로 생각합니다. 모든 경우를 완벽히 계산할 필요는 없지만, 다음 블록이 싫어할 모양을 만들지 않는 습관이 중요합니다."
        ]
      },
      {
        heading: "위기에서는 점수보다 생존 배치를 고릅니다",
        paragraphs: [
          "보드가 높아졌을 때는 큰 점수를 노리는 선택이 오히려 위험합니다. 한 번에 여러 줄을 지우려고 기다리기보다, 당장 한 줄이라도 지워 높이를 낮추는 것이 낫습니다. 생존 배치는 멋지지 않아 보이지만 다음 기회를 만드는 선택입니다.",
          "실패한 판을 복기할 때는 마지막 블록만 보지 말고, 빈칸이 처음 생긴 시점을 찾아보세요. 대부분의 패배는 마지막 실수보다 훨씬 앞에서 시작됩니다. 그 지점을 알면 다음 판의 목표가 분명해집니다."
        ]
      },
      {
        heading: "연습할 때는 금지 규칙을 하나 정합니다",
        paragraphs: [
          "초보자에게 도움이 되는 방법은 한 판마다 작은 금지 규칙을 정하는 것입니다. 예를 들어 이번 판은 가운데에 깊은 구멍을 만들지 않기, 다음 판은 긴 블록 통로를 오른쪽에만 두기, 그다음 판은 보드 절반 이상을 넘기지 않기처럼 기준을 하나만 잡습니다.",
          "금지 규칙을 두면 빠르게 떨어지는 블록 앞에서도 판단이 단순해집니다. 모든 배치를 완벽하게 하려는 부담보다 피해야 할 한 가지를 지키는 편이 쉽고, 그 과정에서 자연스럽게 보드의 모양을 읽는 힘이 늘어납니다.",
          "어느 정도 익숙해졌다면 금지 규칙을 기록 목표와 연결해보세요. 빈칸을 세 개 이하로 유지하기, 상단 세 줄을 쓰지 않고 버티기, 긴 블록 통로를 끝까지 보존하기처럼 확인 가능한 목표를 두면 같은 게임도 연습 과제가 또렷해집니다."
        ]
      }
    ],
    checklist: [
      "초반에는 연속 삭제보다 평평한 바닥을 먼저 만듭니다.",
      "긴 블록 통로는 한쪽 끝에만 유지합니다.",
      "현재 블록을 놓기 전에 다음 블록이 들어갈 자리를 확인합니다.",
      "보드가 높아지면 고득점보다 즉시 줄 삭제를 우선합니다."
    ]
  },
  {
    id: "tic-tac-toe-strategy",
    category: "보드 전략",
    title: "틱택토 전략 가이드: 지지 않는 첫 수와 막는 순서",
    description: "틱택토에서 초보자가 쉽게 놓치는 중앙, 모서리, 포크, 즉시 방어 순서를 실제 플레이 기준으로 정리했습니다.",
    summary: "틱택토는 칸이 9개뿐이라 쉬워 보이지만, 지지 않는 플레이를 하려면 확인 순서가 필요합니다. 내 승리, 상대 승리, 포크 가능성을 차례로 보면 실수가 줄어듭니다.",
    readingTime: "5분",
    relatedGames: [
      { title: "틱택토", href: "/games/tic-tac-toe/", text: "3x3 보드 전략" },
      { title: "사목 미니", href: "/games/connect-four/", text: "연결 전략 확장" },
      { title: "지뢰찾기 미니", href: "/games/mines/", text: "확률과 안전 칸 판단" }
    ],
    sections: [
      {
        heading: "첫 수는 중앙과 모서리가 가장 중요합니다",
        paragraphs: [
          "틱택토에서 중앙은 네 방향의 줄에 동시에 관여합니다. 중앙을 차지하면 공격과 방어 모두 선택지가 늘어납니다. 중앙을 놓쳤다면 모서리를 확보하는 것이 좋습니다. 모서리는 대각선을 만들 수 있어 상대가 막아야 할 줄을 늘리는 데 유리합니다.",
          "가장자리는 나쁜 칸은 아니지만 첫 수로는 힘이 약합니다. 상대가 중앙과 모서리를 가져간 상황에서 가장자리만 두면 공격 루트가 제한되기 쉽습니다. 초보자는 첫 수 기준을 중앙, 모서리, 가장자리 순서로 기억하면 편합니다."
        ]
      },
      {
        heading: "매 턴 확인 순서를 고정합니다",
        paragraphs: [
          "틱택토는 빠르게 누르기보다 확인 순서가 더 중요합니다. 첫째, 내가 지금 바로 이길 수 있는 칸이 있는지 봅니다. 둘째, 상대가 다음 턴에 이길 수 있는 칸을 막습니다. 셋째, 두 줄 위협을 동시에 만드는 포크가 가능한지 봅니다. 이 세 가지를 같은 순서로 확인하면 급한 실수가 줄어듭니다.",
          "많은 패배는 상대의 즉시 승리를 막지 못해서 생깁니다. 내가 좋은 수를 만들 수 있어 보여도 상대가 다음 턴에 끝낼 수 있다면 방어가 우선입니다. 작은 보드일수록 한 번 놓친 방어는 되돌리기 어렵습니다."
        ]
      },
      {
        heading: "포크는 두 개의 위협을 동시에 만드는 수입니다",
        paragraphs: [
          "포크는 한 수를 두었을 때 다음 턴에 이길 수 있는 줄이 두 개 생기는 상황입니다. 상대는 한 턴에 한 곳만 막을 수 있으므로, 제대로 만든 포크는 매우 강합니다. 중앙과 모서리를 함께 잡았을 때 포크가 자주 생깁니다.",
          "반대로 상대가 포크를 만들 수 있는 모양이라면 즉시 막아야 합니다. 단순히 한 줄만 보는 것이 아니라, 상대가 다음에 둘 수 있는 칸이 몇 개의 위협을 만드는지 확인하세요. 이 감각은 사목이나 연결형 보드 게임으로 넘어가도 그대로 도움이 됩니다."
        ]
      },
      {
        heading: "무승부는 실패가 아니라 정확한 플레이의 결과입니다",
        paragraphs: [
          "양쪽이 최선에 가깝게 두면 틱택토는 무승부가 자주 나옵니다. 그래서 무승부를 지루한 결과로 보기보다 실수를 줄였다는 신호로 보면 좋습니다. 특히 어려운 난이도에서는 지지 않는 것이 먼저이고, 그 다음이 이기는 기회를 찾는 것입니다.",
          "한판을 마친 뒤에는 마지막 칸보다 중간에 놓친 위협을 확인해 보세요. 내가 이길 수 있었던 줄을 놓쳤는지, 상대의 두 줄 위협을 늦게 봤는지 살펴보면 다음 판에서 훨씬 안정적으로 둘 수 있습니다."
        ]
      },
      {
        heading: "복기는 빈칸이 네 개 남았을 때부터 보면 좋습니다",
        paragraphs: [
          "틱택토 복기에서 마지막 수만 보면 배울 것이 적습니다. 승패가 갈리는 모양은 보통 빈칸이 네 개 정도 남았을 때 이미 드러납니다. 그 시점에 내가 공격을 이어가야 했는지, 상대의 즉시 승리를 막아야 했는지, 포크를 허용했는지를 확인하면 다음 판에서 같은 실수를 줄일 수 있습니다.",
          "혼자 연습할 때는 일부러 같은 첫 수를 여러 번 반복해보는 것도 좋습니다. 중앙 첫 수와 모서리 첫 수를 각각 몇 판씩 두면 상대 반응에 따라 어떤 방어 순서가 필요한지 눈에 들어옵니다. 작은 보드지만 패턴을 쌓아두면 훨씬 빠르게 판단할 수 있습니다.",
          "초보 단계에서는 승리보다 패배 방지가 더 좋은 목표가 됩니다. 세 판 연속 지지 않기처럼 작은 기준을 세우면 무리한 공격을 줄이고, 상대의 위협을 먼저 보는 습관을 만들 수 있습니다. 이 습관이 쌓이면 이길 기회도 자연스럽게 늘어납니다."
        ]
      }
    ],
    checklist: [
      "첫 수는 가능하면 중앙, 아니면 모서리를 고릅니다.",
      "매 턴 내 즉시 승리와 상대 즉시 승리를 먼저 확인합니다.",
      "두 줄 위협을 동시에 만드는 포크를 찾습니다.",
      "어려운 상대에게는 무승부도 좋은 결과로 보고 실수를 줄입니다."
    ]
  },
  {
    id: "mobile-browser-game-tips",
    category: "모바일 플레이",
    title: "모바일 브라우저 게임을 편하게 즐기는 조작 팁",
    description: "휴대폰 브라우저에서 미니게임을 할 때 화면 가림, 터치 실수, 스크롤, 입력 지연을 줄이는 방법을 정리했습니다.",
    summary: "모바일 게임은 규칙보다 손의 위치가 먼저 체감됩니다. 화면을 가리지 않는 조작, 충분한 버튼 간격, 짧은 터치 리듬을 익히면 같은 게임도 훨씬 편하게 느껴집니다.",
    readingTime: "5분",
    relatedGames: [
      { title: "의자 질주", href: "/games/chair-dash/", text: "좌우 이동과 회피" },
      { title: "플래피 점프", href: "/games/flappy-jump/", text: "짧은 탭 리듬" },
      { title: "향수 소트 공방", href: "/games/perfume-workshop/", text: "터치 선택 퍼즐" }
    ],
    sections: [
      {
        heading: "화면을 가리는 손의 위치부터 줄입니다",
        paragraphs: [
          "모바일에서 가장 흔한 불편은 손가락이 게임판을 가리는 상황입니다. 특히 빠르게 움직이는 공, 장애물, 표적이 있는 게임에서는 손가락이 중앙으로 올라올수록 판단이 늦어집니다. 조작은 가능한 한 화면 아래쪽에서 짧게 하고, 게임판 중앙은 눈으로 볼 수 있게 남기는 것이 좋습니다.",
          "터치 위치를 계속 크게 옮기면 손이 화면을 더 많이 가립니다. 좌우 이동 게임에서는 손가락을 뗐다 붙이기보다 작은 범위 안에서 끌어 움직이는 방식이 안정적일 때가 많습니다. 반대로 플래피류 게임은 긴 누름보다 짧은 탭을 나눠 쓰는 편이 높이를 조절하기 좋습니다."
        ]
      },
      {
        heading: "브라우저 스크롤과 게임 조작을 구분합니다",
        paragraphs: [
          "웹게임은 앱과 달리 페이지 스크롤이 함께 존재합니다. 게임판을 누르는 중 화면이 움직이면 조작이 끊긴 것처럼 느껴질 수 있습니다. 게임을 시작하기 전에 게임판이 화면 중앙에 오도록 맞추고, 주소창이 접힌 상태에서 플레이하면 불필요한 움직임을 줄일 수 있습니다.",
          "긴 글이 있는 게임 상세 페이지에서는 설명을 읽은 뒤 실제 플레이 영역으로 이동해 시작하는 것이 좋습니다. 한판게임즈의 게임 페이지는 플레이 영역과 공략 글을 함께 두기 때문에, 먼저 규칙을 보고 바로 아래나 옆의 게임판에서 확인하는 흐름을 의도합니다."
        ]
      },
      {
        heading: "터치는 세게 누르기보다 짧고 일정하게 누릅니다",
        paragraphs: [
          "휴대폰 화면은 세게 누른다고 입력이 빨라지지 않습니다. 오히려 손에 힘이 들어가면 다음 입력이 늦어지고, 같은 위치를 반복해서 누를 때 피로가 빨리 옵니다. 클릭 스프린트나 점프 게임에서는 손가락을 가볍게 올려두고 짧게 튕기듯 누르는 편이 안정적입니다.",
          "퍼즐 게임에서는 급하게 두 번 누르는 실수를 줄여야 합니다. 향수 소트나 슬라이딩 퍼즐처럼 선택 순서가 중요한 게임은 첫 선택 뒤 화면 반응을 확인하고 다음 선택을 하는 것이 좋습니다. 속도보다 정확한 입력이 결과를 더 크게 바꿉니다."
        ]
      },
      {
        heading: "배터리와 발열도 플레이 감각에 영향을 줍니다",
        paragraphs: [
          "브라우저 게임은 가볍게 실행되지만, 오래 켜두면 기기 상태에 따라 화면 주사율이나 터치 반응이 달라질 수 있습니다. 반응속도처럼 짧은 시간 차이를 보는 게임은 특히 이런 영향을 체감하기 쉽습니다. 기록이 갑자기 흔들린다면 게임 실력보다 기기 상태를 먼저 의심해도 됩니다.",
          "긴 시간 플레이할 때는 밝기를 조금 낮추고, 다른 무거운 앱을 닫은 뒤 진행하면 입력이 더 안정적으로 느껴질 수 있습니다. 짧은 미니게임은 부담 없이 즐기는 것이 장점이므로, 기록이 잘 안 나오는 날에는 다른 장르로 바꿔 가볍게 마무리하는 것도 좋은 선택입니다."
        ]
      },
      {
        heading: "장르마다 편한 휴대폰 잡는 법이 다릅니다",
        paragraphs: [
          "원버튼 게임은 한 손으로도 충분하지만, 좌우 이동 게임은 양손으로 잡고 엄지 하나를 조작에 쓰는 편이 안정적일 수 있습니다. 퍼즐 게임은 빠른 반응보다 정확한 선택이 중요하므로 화면을 책상 위에 두고 천천히 누르는 방식도 잘 맞습니다.",
          "게임마다 가장 편한 자세가 다르다는 점을 인정하면 모바일 플레이가 훨씬 편해집니다. 기록이 잘 나오지 않을 때는 게임 자체보다 잡는 방식, 화면 밝기, 손가락이 닿는 위치를 먼저 바꿔보세요. 작은 조정만으로도 터치 실수와 피로가 크게 줄어듭니다."
        ]
      }
    ],
    checklist: [
      "게임판 중앙을 손가락으로 가리지 않는 위치를 찾습니다.",
      "플레이 전에 페이지 스크롤이 안정된 상태인지 확인합니다.",
      "짧은 탭과 작은 드래그를 우선 사용합니다.",
      "기록이 갑자기 흔들리면 기기 발열과 배터리 상태도 함께 봅니다."
    ]
  }
];

const entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => entityMap[char]);
}

function headerHtml(current = "guides") {
  const nav = [
    ["게임", "/games/", "games"],
    ["가이드", "/guides/", "guides"],
    ["소개", "/about/", "about"],
    ["도움말", "/help/", "help"],
    ["문의", "/contact/", "contact"]
  ];

  return `<header class="site-header">
      <a class="brand" href="/" aria-label="한판게임즈 홈">
        <span class="brand-mark" aria-hidden="true">H</span>
        <span><strong>한판게임즈</strong><small>HANPAN GAMES</small></span>
      </a>
      <nav class="nav" aria-label="주요 메뉴">
        ${nav.map(([label, href, key]) => `<a href="${href}"${key === current ? ` aria-current="page"` : ""}>${label}</a>`).join("\n        ")}
      </nav>
    </header>`;
}

function footerHtml() {
  return `<footer class="site-footer">
      <div>
        <strong>한판게임즈</strong>
        <p>플레이하기 쉽고 읽을거리도 있는 무료 미니게임 허브.</p>
      </div>
      <nav aria-label="푸터 메뉴">
        <a href="/about/">소개</a>
        <a href="/help/">도움말</a>
        <a href="/updates/">업데이트</a>
        <a href="/privacy/">개인정보처리방침</a>
        <a href="/terms/">이용약관</a>
        <a href="/contact/">문의</a>
      </nav>
      <p class="copyright">© <span id="year"></span> Hanpan Games. All rights reserved.</p>
    </footer>`;
}

function guideCardHtml(guide) {
  return `<a class="featured-link" href="/guides/${guide.id}/">
              <strong>${escapeHtml(guide.title)}</strong>
              <span>${escapeHtml(guide.description)}</span>
            </a>`;
}

function relatedGameHtml(game) {
  return `<a class="featured-link" href="${game.href}">
              <strong>${escapeHtml(game.title)}</strong>
              <span>${escapeHtml(game.text)}</span>
            </a>`;
}

function guidePageHtml(guide) {
  const canonical = `${siteUrl}/guides/${guide.id}/`;
  const otherGuides = guides.filter((item) => item.id !== guide.id).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: publishedDate,
    dateModified: publishedDate,
    inLanguage: "ko-KR",
    mainEntityOfPage: canonical,
    author: {
      "@type": "Organization",
      name: "Hanpan Games"
    },
    publisher: {
      "@type": "Organization",
      name: "Hanpan Games",
      url: siteUrl
    }
  };

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    ${adsenseScript}
    ${searchConsoleVerification}
    <title>${escapeHtml(guide.title)} - 한판게임즈</title>
    <meta name="description" content="${escapeHtml(guide.description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeHtml(guide.title)}">
    <meta property="og:description" content="${escapeHtml(guide.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="한판게임즈">
    <meta name="twitter:card" content="summary">
    <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
  </head>
  <body>
    ${headerHtml("guides")}

    <main class="subpage article-page">
      <section class="page-title">
        <p class="eyebrow">${escapeHtml(guide.category)} · ${guide.readingTime}</p>
        <h1>${escapeHtml(guide.title)}</h1>
        <p>${escapeHtml(guide.summary)}</p>
        <ul class="toc-list">
          ${guide.sections.map((section, index) => `<li><a href="#section-${index + 1}">${escapeHtml(section.heading)}</a></li>`).join("\n          ")}
          <li><a href="#checklist">플레이 체크리스트</a></li>
          <li><a href="#related-games">관련 게임</a></li>
        </ul>
      </section>

      <article class="article featured-article">
        ${guide.sections.map((section, index) => `<h2 id="section-${index + 1}">${escapeHtml(section.heading)}</h2>
        ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ")}`).join("\n\n        ")}

        <h2 id="checklist">플레이 체크리스트</h2>
        <ul class="detail-list">
          ${guide.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n          ")}
        </ul>
      </article>

      <section id="related-games" class="featured-games" aria-labelledby="related-games-title">
        <div class="section-heading">
          <p class="eyebrow">Play next</p>
          <h2 id="related-games-title">글과 함께 해보기 좋은 게임</h2>
        </div>
        <div class="featured-link-grid">
          ${guide.relatedGames.map(relatedGameHtml).join("\n          ")}
        </div>
      </section>

      <section class="featured-games" aria-labelledby="related-guides-title">
        <div class="section-heading">
          <p class="eyebrow">More guides</p>
          <h2 id="related-guides-title">함께 읽기</h2>
        </div>
        <div class="featured-link-grid">
          ${otherGuides.map(guideCardHtml).join("\n          ")}
        </div>
      </section>
    </main>

    ${footerHtml()}
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script src="/assets/app.js?v=${assetVersion}" defer></script>
  </body>
</html>
`;
}

function guideIndexHtml() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "한판게임즈 게임 가이드",
    description: "무료 웹 미니게임을 더 편하게 즐기기 위한 플레이 팁과 장르별 공략 모음입니다.",
    url: `${siteUrl}/guides/`,
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: "Hanpan Games",
      url: siteUrl
    }
  };

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    ${adsenseScript}
    ${searchConsoleVerification}
    <title>게임 가이드와 플레이 팁 - 한판게임즈</title>
    <meta name="description" content="한판게임즈의 무료 웹 미니게임 가이드입니다. 짧은 휴식 게임 선택법, 벽돌깨기, 블록 드롭, 틱택토, 모바일 조작 팁을 안내합니다.">
    <link rel="canonical" href="${siteUrl}/guides/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="게임 가이드와 플레이 팁 - 한판게임즈">
    <meta property="og:description" content="무료 웹 미니게임을 더 편하게 즐기기 위한 플레이 팁과 장르별 공략 모음입니다.">
    <meta property="og:url" content="${siteUrl}/guides/">
    <meta property="og:site_name" content="한판게임즈">
    <meta name="twitter:card" content="summary">
    <link rel="stylesheet" href="/assets/styles.css?v=${assetVersion}">
  </head>
  <body>
    ${headerHtml("guides")}

    <main class="subpage article-page">
      <section class="page-title">
        <p class="eyebrow">Guide</p>
        <h1>게임 가이드와 플레이 팁</h1>
        <p>
          한판게임즈의 가이드는 게임을 시작하기 전 오래 붙잡는 설명서가 아니라, 한 판을 더 잘 이해하기 위한 짧은 공략입니다.
          조작, 기록, 모바일 환경, 장르별 기본기를 실제 플레이 기준으로 정리합니다.
        </p>
      </section>

      <section class="featured-games" aria-labelledby="guide-list-title">
        <div class="section-heading">
          <p class="eyebrow">New articles</p>
          <h2 id="guide-list-title">최근 발행한 가이드</h2>
          <p>각 글은 독립 URL로 제공되며 관련 게임 페이지와 서로 연결되어 있습니다.</p>
        </div>
        <div class="featured-link-grid">
          ${guides.map(guideCardHtml).join("\n          ")}
        </div>
      </section>

      <article class="article">
        <h2>짧은 게임은 시작이 빨라야 합니다</h2>
        <p>
          한판게임즈의 목표는 복잡한 설치나 계정 없이도 바로 시작할 수 있는 짧은 게임 경험입니다.
          처음 방문한 사용자는 게임 목록에서 장르와 예상 플레이 시간을 보고 고를 수 있어야 하며, 게임 페이지에 들어갔을 때는 조작법과 시작 버튼이 쉽게 보여야 합니다.
        </p>
        <p>
          게임을 고를 때는 지금 필요한 감각을 먼저 생각하면 좋습니다. 반응속도와 클릭 게임은 잠깐 손을 풀기에 좋고,
          기억 타일이나 숫자 금고는 머리를 가볍게 전환하기에 좋습니다. 벽돌깨기, 블록 드롭, 퐁처럼 고전 아케이드 계열은 짧은 규칙 안에서 손의 리듬을 익히는 재미가 있습니다.
        </p>

        <h2>기록은 내 기기에서 가볍게 확인합니다</h2>
        <p>
          게임 기록은 현재 버전에서 브라우저 안에 저장되는 방식을 기본으로 합니다. 별도 회원가입 없이도 이전 기록을 확인할 수 있고,
          기기를 바꾸거나 브라우저 데이터를 삭제하면 기록이 초기화될 수 있습니다. 이 구조는 부담 없이 한 판을 시작하는 미니게임 사이트의 성격과 잘 맞습니다.
        </p>
        <p>
          최고 기록은 재미있는 기준이지만, 한 번의 숫자만으로 실력을 판단할 필요는 없습니다. 반응속도 게임은 여러 번의 평균이 중요하고,
          퍼즐 게임은 완료 여부보다 막힌 순간을 돌아보는 것이 실력 향상에 더 도움이 됩니다.
        </p>

        <h2>모바일과 데스크톱의 플레이 감각은 다릅니다</h2>
        <p>
          데스크톱에서는 키보드와 마우스로 빠른 입력이 가능하지만, 모바일에서는 손가락이 화면을 가리는 문제가 생깁니다.
          그래서 터치 게임은 버튼 간격, 게임판 위치, 짧은 탭 반응이 중요합니다. 같은 게임이라도 화면 크기에 따라 더 편한 자세와 조작 리듬이 달라질 수 있습니다.
        </p>
        <p>
          한판게임즈는 게임판과 설명, 결과 메시지가 서로 겹치지 않도록 구성하는 것을 운영 원칙으로 삼습니다.
          새 게임을 추가할 때도 사용자가 실수로 다른 요소를 누르지 않도록 충분한 간격을 두고, 가능한 한 키보드와 터치 입력을 함께 지원하는 방향을 유지합니다.
        </p>

        <h2>새 글과 게임 페이지를 함께 보강합니다</h2>
        <p>
          게임 사이트에서 글은 단순한 장식이 아니라 사용자가 어떤 게임을 왜 해볼지 판단하는 기준이 됩니다.
          그래서 가이드 글은 특정 게임의 조작, 실패 원인, 기록을 읽는 방법을 중심으로 작성합니다. 게임 페이지에는 실제 플레이 영역을 두고,
          가이드에는 그 플레이를 더 잘 이해하는 설명을 연결해 사이트 전체가 하나의 경험으로 이어지게 합니다.
        </p>
      </article>
    </main>

    ${footerHtml()}
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script src="/assets/app.js?v=${assetVersion}" defer></script>
  </body>
</html>
`;
}

for (const guide of guides) {
  const dir = path.join(publicDir, "guides", guide.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), guidePageHtml(guide), "utf8");
}

fs.writeFileSync(path.join(publicDir, "guides", "index.html"), guideIndexHtml(), "utf8");
console.log(`Generated ${guides.length} editorial guide pages.`);
