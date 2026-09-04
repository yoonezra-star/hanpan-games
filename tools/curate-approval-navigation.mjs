import fs from "node:fs";
import path from "node:path";
import {
  FLAGSHIP_GAME_IDS,
  INDEXABLE_GAME_IDS,
  indexableGameIds,
  indexableGuideIds,
} from "./content-quality.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public");

function updateFile(relativePath, transform) {
  const filePath = path.join(publicDir, relativePath);
  const before = fs.readFileSync(filePath, "utf8");
  const after = transform(before);
  if (before !== after) fs.writeFileSync(filePath, after, "utf8");
}

function filterLinkedBlocks(html, pattern, allowedIds) {
  return html.replace(pattern, (block, id) => allowedIds.has(id) ? block : "");
}

const flagshipEditorialSections = {
  "mines": {
    intro: "지뢰찾기 기록은 단순히 빨리 누른 시간이 아니라 확실한 근거를 얼마나 연속으로 찾았는지 보여 줍니다. 이번 판 도전은 열린 안전 칸의 비율을 기준으로 현재 진행을 세 단계로 나눕니다.",
    tiers: ["25% · 첫 숫자 경계를 만든 뒤 닫힌 칸과 깃발 수를 비교합니다.", "60% · 한쪽 구역을 마무리하고 남은 숫자 경계를 다시 훑습니다.", "100% · 힌트 없이 모든 안전 칸을 열면 난이도별 최고 시간 비교 대상이 됩니다."],
    reading: "진행이 오래 멈춘다면 판 전체를 보지 말고 닫힌 칸과 맞닿은 숫자만 따라가세요. 남은 지뢰 수가 빠르게 줄어도 잘못된 깃발이 섞이면 연쇄 열기에서 실패할 수 있으므로, 속도보다 깃발의 근거가 우선입니다."
  },
  "card-solitaire": {
    intro: "솔리테어의 정리 수치는 네 기초 더미에 올라간 카드 수입니다. 이동 횟수만 줄이는 것보다 뒤집힌 카드를 공개하고 기초 더미로 보낼 통로를 만드는 과정이 완주 가능성을 더 잘 보여 줍니다.",
    tiers: ["13장 · 한 무늬 분량을 정리하며 낮은 카드의 이동 경로를 확보합니다.", "26장 · 카드 절반을 기초 더미로 옮기고 남은 숨은 카드 수를 확인합니다.", "52장 · 네 무늬를 A부터 K까지 완성하면 완주 시간 기록이 저장됩니다."],
    reading: "정리 수가 늘지 않는데 이동만 많아지면 기초 더미를 너무 빨리 올렸거나 빈 열을 쓸 K 묶음이 막힌 경우가 많습니다. 숨은 카드 수가 줄어드는 이동을 먼저 찾고, 힌트는 막힌 원인을 확인하는 용도로 사용하세요."
  },
  "sudoku-mini": {
    intro: "스도쿠의 입력 수치는 처음 비어 있던 칸 가운데 확정 숫자를 채운 개수입니다. 후보 메모는 입력 수에 포함하지 않으므로, 메모를 많이 남기는 것보다 후보를 실제 확정으로 바꾸는 흐름을 확인할 수 있습니다.",
    tiers: ["15칸 · 단서가 많은 행과 박스부터 확정 숫자를 채웁니다.", "35칸 · 후보 쌍과 박스·행 교차를 사용해 후반 선택지를 줄입니다.", "51칸 · 모든 빈칸을 맞히고 힌트가 없다면 난이도별 최고 시간을 비교합니다."],
    reading: "입력 수가 멈추면 후보가 적은 칸 하나만 오래 보기보다 특정 숫자가 들어갈 수 있는 위치가 한 곳뿐인 행·열·박스를 찾으세요. 실수 수가 늘면 최근 입력을 되돌리고 그 숫자가 같은 박스와 열에 이미 있었는지부터 확인하는 편이 빠릅니다."
  },
  "twenty-48": {
    intro: "2048의 최대 타일은 한 번의 큰 합치기보다 보드 운영이 얼마나 오래 유지됐는지를 보여 줍니다. 이번 판 도전은 128, 512, 2048을 기준으로 큰 타일과 빈칸 관리가 안정되는 구간을 나눕니다.",
    tiers: ["128 · 가장 큰 타일을 한 모서리에 고정하는 기본 대형을 만듭니다.", "512 · 큰 타일 옆에 절반 크기 타일을 계단처럼 연결합니다.", "2048 · 빈칸을 유지하며 마지막 두 1024 타일의 합칠 방향을 확보합니다."],
    reading: "최대 타일은 높지만 점수가 더 오르지 않으면 큰 타일 주변에 낮은 숫자가 흩어진 상태일 가능성이 큽니다. 이동 뒤 빈칸이 세 칸 이하라면 당장 큰 숫자를 만드는 수보다 낮은 타일 두 개를 정리하는 수를 먼저 검토하세요."
  },
  "block-drop-classic": {
    intro: "블록 드롭의 삭제 줄은 점수보다 쉽게 비교할 수 있는 생존 지표입니다. 두 줄은 기본 조작, 열 줄은 보드 높이 관리, 서른 줄은 다음 블록과 홀드를 함께 읽는 안정성을 확인하는 기준입니다.",
    tiers: ["2줄 · 회전과 즉시 낙하를 익히며 첫 빈틈 없는 바닥을 만듭니다.", "10줄 · 높은 기둥을 줄이고 긴 블록용 세로 통로를 유지합니다.", "30줄 · 속도가 오른 뒤에도 홀드와 다음 블록 3개로 위험 배치를 피합니다."],
    reading: "삭제 줄이 늘지 않는데 보드만 높아지면 한 번에 네 줄을 노리느라 깊은 구멍을 만든 경우가 많습니다. 구멍 위를 덮는 블록을 피하고, 최고점이 좌우로 급격히 달라지면 한 줄 삭제라도 먼저 만들어 높이를 낮추세요."
  },
  "brick-break": {
    intro: "벽돌깨기의 스테이지는 점수보다 판의 생존력과 반사각 운영을 함께 보여 주는 기록입니다. 같은 벽돌을 오래 왕복해서 맞히는 것보다 목숨을 보존하며 다음 배치로 넘어가는 흐름을 세 단계로 확인합니다.",
    tiers: ["스테이지 2 · 첫 배치를 정리하면서 공의 복귀 위치를 안정시킵니다.", "스테이지 3 · 패들 가장자리 반사와 아이템 회수 타이밍을 함께 관리합니다.", "스테이지 5 · 빨라진 공과 멀티볼 상황에서도 중앙 수비 위치를 유지합니다."],
    reading: "점수와 콤보는 오르는데 스테이지가 멈추면 공이 같은 통로만 왕복하고 있을 가능성이 큽니다. 패들 가장자리로 반사각을 바꾸되 목숨이 하나라면 과한 각도보다 받아 내기 쉬운 중앙 반사를 우선하세요."
  },
  "snake-garden": {
    intro: "뱀의 길이는 먹이를 얼마나 모았는지와 좁아진 공간을 얼마나 오래 관리했는지를 동시에 보여 줍니다. 점수 보너스보다 판의 실제 진행을 안정적으로 비교할 수 있도록 길이 6, 10, 15를 도전 기준으로 삼습니다.",
    tiers: ["길이 6 · 벽과 몸통에서 두 칸 이상 떨어진 기본 순환 경로를 만듭니다.", "길이 10 · 먹이로 들어가기 전에 빠져나올 방향을 먼저 확보합니다.", "길이 15 · 몸통이 긴 후반에도 정원 바깥쪽 순환로를 끊지 않습니다."],
    reading: "점수는 오르는데 길이가 늘지 않는다면 보너스만 쫓거나 충돌 뒤 새 판을 반복한 상태일 수 있습니다. 머리 앞 한 칸보다 두세 수 뒤의 탈출 공간을 보고, 몸통이 접힌 안쪽으로 들어갈 때는 꼬리가 비울 칸까지 계산하세요."
  },
  "freecell-classic": {
    intro: "프리셀의 정리 수치는 네 기초 더미로 옮긴 카드 수입니다. 모든 카드가 처음부터 보이므로 운보다 빈 열과 프리셀을 얼마나 효율적으로 남겼는지가 13장, 26장, 52장 구간에서 분명하게 드러납니다.",
    tiers: ["13장 · 낮은 카드 한 무늬 분량을 올리며 첫 이동 통로를 확보합니다.", "26장 · 카드 절반을 정리하고 빈 열 또는 프리셀 여유를 유지합니다.", "52장 · 네 무늬를 A부터 K까지 모두 기초 더미에 완성합니다."],
    reading: "정리 수가 멈추고 네 프리셀이 모두 찼다면 이동 가능 용량을 너무 일찍 소모한 경우가 많습니다. 빈 열은 단순 보관칸이 아니라 옮길 수 있는 카드 묶음의 크기를 늘리는 자원이므로, 당장 한 장을 빼기보다 다음 연속 이동까지 확인하세요."
  },
  "tic-tac-toe": {
    intro: "틱택토는 단판 결과보다 3선승 매치 점수로 공격과 방어가 반복해서 유지되는지 확인하는 편이 정확합니다. 이번 판 도전은 현재 X와 O 가운데 더 높은 승수를 읽어 매치의 진행 단계를 표시합니다.",
    tiers: ["1승 · 즉시 승리와 상대의 한 줄 완성 차단 순서를 지킵니다.", "2승 · 매치 포인트에서도 포크 생성과 포크 차단을 먼저 확인합니다.", "3승 · 한쪽이 세 판을 먼저 이겨 매치를 마무리합니다."],
    reading: "어려움 AI는 완전탐색을 사용하므로 승리보다 패배하지 않는 무승부가 올바른 방어의 증거입니다. 쉬움과 보통에서는 승수가 오르지 않을 때 중앙·모서리 선점보다 상대의 즉시 승리 칸을 먼저 놓치지 않았는지 복기하세요."
  },
  "connect-four": {
    intro: "사목은 현재 가장 많은 말을 둔 쪽의 착수 수와 대국 종료 여부로 진행을 읽습니다. 말의 개수 자체가 우세를 뜻하지는 않지만, 초반 전개부터 즉시 위협을 주고받는 구간까지 한 판의 리듬을 확인하는 기준이 됩니다.",
    tiers: ["두 수 전개 · 중앙 열을 중심으로 다음 말이 놓일 받침을 만듭니다.", "세 수 전개 · 가로와 대각선 두 방향에 동시에 이어질 후보를 확인합니다.", "한 판 마무리 · 네 개 연결 또는 무승부가 확정될 때까지 대국을 진행합니다."],
    reading: "착수 수가 늘어도 가장 아래 빈칸에만 말이 놓인다는 규칙 때문에 떠 있는 대각선은 즉시 완성할 수 없습니다. 내 세 수를 잇기 전에 상대가 다음 차례에 완성할 열을 먼저 막고, 중앙 열을 차지해 더 많은 가로·대각선 경로를 남기세요."
  },
  "maze-chase": {
    intro: "미로 추격의 수집량은 한 스테이지의 73개 빛 조각 가운데 현재까지 먹은 개수입니다. 점수에는 이전 스테이지와 보너스가 섞이므로, 20개·50개·73개 구간이 현재 미로를 얼마나 정리했는지 더 직접적으로 보여 줍니다.",
    tiers: ["20개 · 시작 구역과 가까운 통로를 정리하며 추격자의 위치를 확인합니다.", "50개 · 남은 조각이 흩어지지 않도록 한쪽 구역씩 완전히 비웁니다.", "73개 · 마지막 조각까지 모아 목숨을 유지한 채 다음 스테이지로 넘어갑니다."],
    reading: "수집량이 멈추고 목숨만 줄면 벽 앞에서 방향 전환이 늦거나 막다른 길을 먼저 들어간 경우가 많습니다. 남은 조각 수가 적을수록 가장 가까운 점보다 조각이 모인 구역과 그곳에서 빠져나올 교차로를 함께 보세요."
  },
  "match-three": {
    intro: "매치3의 스테이지는 점수 목표와 지정 색상 제거 목표를 모두 달성했을 때만 올라갑니다. 단순한 고득점보다 두 목표를 제한 이동 안에서 함께 관리하는 능력을 2·3·5단계 기준으로 비교할 수 있습니다.",
    tiers: ["스테이지 2 · 아래쪽 매치로 낙하 연쇄를 만들며 첫 목표를 완료합니다.", "스테이지 3 · 줄폭탄과 지정 색상 제거를 한 번의 교환에 함께 연결합니다.", "스테이지 5 · 이동 수가 줄어든 후반에도 확실한 목표 진행을 우선합니다."],
    reading: "점수는 충분한데 스테이지가 멈췄다면 지정 색상 수가 부족한 상태이고, 색상 목표만 앞섰다면 연쇄 배율을 만들지 못한 상태일 수 있습니다. 남은 이동이 적을 때는 큰 연쇄의 가능성보다 두 목표 중 뒤처진 값을 확실히 줄이는 교환을 고르세요."
  },
  "sliding-puzzle": {
    intro: "슬라이딩 퍼즐의 진행률은 빈칸을 제외한 타일 가운데 숫자와 자리가 일치하는 비율입니다. 3×3과 4×4를 같은 기준으로 비교하되, 중간 풀이에서는 경로를 만들기 위해 이미 맞춘 타일을 잠시 빼야 할 수 있습니다.",
    tiers: ["40% · 윗줄 또는 첫 구역의 숫자 순서를 안정시킵니다.", "75% · 마지막 두 줄로 들어갈 빈칸 순환 경로를 남깁니다.", "100% · 모든 숫자를 제자리에 놓고 빈칸을 오른쪽 아래에 맞춥니다."],
    reading: "진행률이 잠시 내려가는 것은 항상 실수가 아닙니다. 마지막 두 타일을 한 쌍으로 넣거나 빈칸을 목표 위치로 돌릴 때는 완성 구역 일부를 열어야 하므로, 한 수의 비율보다 다시 복구할 순환 경로가 있는지를 기준으로 판단하세요."
  },
  "hangman": {
    intro: "행맨의 연승은 서로 다른 단어를 연속으로 완성한 횟수입니다. 한 단어의 점수보다 글자 빈도, 카테고리 힌트와 남은 실수 기회를 여러 판에 걸쳐 안정적으로 활용했는지 보여 주는 기록입니다.",
    tiers: ["1연승 · 자주 쓰는 글자와 뜻 힌트로 첫 단어를 완성합니다.", "3연승 · 전체 단어 추리는 후보가 충분히 좁혀진 뒤에만 사용합니다.", "5연승 · 난이도별 실수 한도를 지키며 다섯 단어를 이어 풉니다."],
    reading: "남은 칸은 적은데 실수가 빠르게 늘면 공개된 글자의 위치보다 빈도만 따라간 경우가 많습니다. 영문은 모음과 자주 쓰는 자음을 나눠 확인하고, 한글은 카테고리와 뜻에서 단어 후보를 먼저 만든 뒤 필요한 초성을 선택하세요."
  },
  "flappy-jump": {
    intro: "플래피 점프의 통과 수는 기둥 한 쌍을 완전히 지난 횟수입니다. 한 번의 입력 강도는 같으므로, 1개·5개·10개 구간은 기둥 중앙을 향해 입력 간격을 일정하게 조절하는 능력을 보여 줍니다.",
    tiers: ["1개 · 첫 기둥의 틈 중앙을 통과해 점프와 낙하 리듬을 확인합니다.", "5개 · 기둥 직전의 급한 연속 입력 없이 일정한 높이를 유지합니다.", "10개 · 난이도별 속도와 틈 크기에 맞춘 입력 간격으로 두 자릿수 기록을 만듭니다."],
    reading: "충돌 위치가 틈 위쪽이면 입력이 너무 늦게 몰렸고, 아래쪽이면 다음 점프를 기다린 시간이 길었던 경우가 많습니다. 기체가 틈 중앙에 도착했을 때가 아니라 기둥 앞에서 현재 상승·하강 방향을 보고 미리 한 번 입력하세요."
  }
};

function flagshipEditorialHtml(section) {
  return `<!-- FLAGSHIP_RECORD_GUIDE_START -->
          <div class="flagship-record-guide" id="record-challenges">
            <h2>기록 도전과 판세 읽기</h2>
            <p>${section.intro}</p>
            <ul class="strategy-list">
              ${section.tiers.map((tier) => `<li>${tier}</li>`).join("\n              ")}
            </ul>
            <h3>현재 기록을 해석하는 기준</h3>
            <p>${section.reading}</p>
          </div>
          <!-- FLAGSHIP_RECORD_GUIDE_END -->`;
}

const categoryHubGuides = {
  arcade: {
    title: "조작 방식으로 고르는 아케이드 게임",
    intro: [
      "아케이드 게임은 규칙을 외우는 시간보다 움직임에 적응하는 시간이 기록을 좌우합니다. 같은 액션 장르라도 벽돌깨기는 패들 위치와 반사각, 뱀의 정원은 다음 칸과 탈출 공간, 미로 추격은 교차로와 추격자 거리, 플래피 점프는 한 번의 입력 간격을 읽습니다.",
      "처음에는 익숙한 제목보다 사용할 입력 장치와 원하는 한 판 길이를 먼저 고르는 편이 좋습니다. 드래그를 편하게 쓰면 벽돌깨기, 방향키나 화면 방향 버튼을 선호하면 뱀과 미로, 한 손 터치만 원하면 플래피 점프가 빠르게 시작하기 좋습니다."
    ],
    picks: [
      ["brick-break", "벽돌깨기 미니", "반사각 · 2분", "패들 가장자리와 아이템을 이용해 스테이지를 이어 갑니다."],
      ["snake-garden", "뱀의 정원", "경로 설계 · 2분", "먹이보다 몸통 뒤에 남을 탈출 공간을 먼저 계산합니다."],
      ["maze-chase", "미로 추격 클래식", "수집·회피 · 4분", "73개 조각을 구역별로 모으며 추격자와 거리를 유지합니다."]
    ],
    rows: [
      ["벽돌깨기", "드래그·좌우키", "약 2분", "스테이지·콤보"],
      ["뱀의 정원", "방향키·버튼", "약 2분", "길이·단계"],
      ["미로 추격", "방향키·버튼", "약 4분", "수집량·스테이지"],
      ["플래피 점프", "터치·Space", "실패까지", "기둥 통과 수"]
    ],
    choice: "짧은 성공과 실패가 분명한 게임을 원하면 플래피 점프가 맞습니다. 한 판 안에서 회복할 기회와 아이템 변수가 필요하면 벽돌깨기, 매 순간 다음 경로를 생각하는 플레이는 뱀의 정원, 정해진 맵을 익혀 동선을 줄이는 방식은 미로 추격이 적합합니다. 실시간 게임이 낯설다면 쉬움 또는 느림 속도에서 조작과 화면 변화가 어떻게 연결되는지 먼저 확인하세요.",
    practice: "첫 세 판은 최고 점수보다 같은 원인으로 연속 실패하지 않는 것을 목표로 삼습니다. 벽돌깨기는 공을 놓친 위치, 뱀은 몸통에 막힌 방향, 미로는 잡힌 교차로, 플래피는 틈의 위·아래 중 어느 쪽에 부딪혔는지를 기억하면 다음 판의 수정점이 분명해집니다. 기록이 멈추면 속도를 올리기보다 입력을 한 번 줄이고 다음 위치를 더 일찍 보는 편이 효과적입니다.",
    mobile: "모바일에서는 손가락이 게임판을 가리지 않도록 화면 버튼이나 게임판 아래쪽을 사용하세요. 가로 화면과 전체화면은 미로와 뱀처럼 주변 공간을 넓게 봐야 하는 게임에 특히 유용합니다. 탭을 벗어나면 자동 일시정지를 지원하는 게임은 돌아온 뒤 직접 계속을 눌러 입력 방향을 다시 확인하는 것이 안전합니다.",
    records: "점수만 비교하면 게임별 실력 차이를 읽기 어렵습니다. 벽돌깨기는 스테이지, 뱀은 길이, 미로는 한 스테이지의 수집량, 플래피는 통과 수를 먼저 보세요. 같은 난이도와 속도에서 세 판 이상 플레이한 뒤 최고 기록과 평균적인 도달 구간을 함께 보면 우연한 한 판과 안정된 실력을 구분할 수 있습니다.",
    checklist: ["한 손 터치, 방향 입력, 드래그 중 편한 방식을 먼저 고릅니다.", "첫 판은 쉬움 또는 표준 속도에서 화면 변화와 충돌 조건을 확인합니다.", "실패 위치를 한 가지 원인으로 설명한 뒤 다음 판의 입력을 바꿉니다.", "모바일에서 게임판이 좁다면 가로 화면 또는 전체화면을 사용합니다.", "최고 점수와 함께 스테이지·길이·통과처럼 규칙에 가까운 기록을 봅니다."]
  },
  board: {
    title: "상대 대전과 카드 정리 중에서 고르기",
    intro: [
      "보드·전략 게임은 빠른 손보다 현재 수가 다음 선택지를 어떻게 바꾸는지 읽는 힘이 중요합니다. 틱택토와 사목은 상대가 다음 차례에 완성할 줄을 막으면서 내 이중 위협을 만들고, 솔리테어와 프리셀은 빈 열과 임시칸을 카드 이동 가능성을 넓히는 자원으로 사용합니다.",
      "짧은 대국과 즉시 결과를 원하면 틱택토나 사목, 혼자 오래 생각하며 완주하는 흐름을 원하면 솔리테어나 프리셀이 잘 맞습니다. 처음부터 모든 카드가 보이는 논리 퍼즐을 선호하면 프리셀, 숨은 카드를 차례로 공개하는 변화를 좋아하면 솔리테어를 선택하세요."
    ],
    picks: [
      ["tic-tac-toe", "틱택토", "3선승 · AI/2인", "즉시 승리, 차단과 포크 순서로 짧은 매치를 진행합니다."],
      ["card-solitaire", "카드 솔리테어", "클론다이크 · 8분", "숨은 카드를 열고 네 기초 더미에 52장을 정리합니다."],
      ["freecell-classic", "프리셀 클래식", "공개 정보 · 10분", "네 프리셀과 빈 열의 이동 용량을 계산해 완주합니다."]
    ],
    rows: [
      ["틱택토", "AI·같은 기기 2인", "약 2분", "단판·3선승"],
      ["사목", "AI·같은 기기 2인", "약 2분", "승패·연승"],
      ["솔리테어", "혼자 카드 정리", "약 8분", "정리 카드·완주 시간"],
      ["프리셀", "혼자 공개 퍼즐", "약 10분", "정리 카드·이동 수"]
    ],
    choice: "대전형 게임에서는 내 공격 모양보다 상대의 즉시 승리 칸을 먼저 확인해야 합니다. 틱택토는 3×3이라 전체 경우를 빠르게 볼 수 있고, 사목은 말이 아래에서 쌓이므로 실제로 다음 수에 놓을 수 있는 칸인지까지 확인해야 합니다. 카드 게임은 시간 압박이 없으므로 한 장을 옮기기 전에 빈 열과 임시칸이 얼마나 남는지 계산하는 습관이 중요합니다.",
    practice: "틱택토는 어려움 AI에서 무승부를 유지하는 것을 방어 연습으로 삼고, 사목은 중앙 열과 상대의 세 개 연결을 매번 확인하세요. 솔리테어는 숨은 카드를 공개하는 이동을 우선하고, 프리셀은 빈 열 하나를 확보했을 때 옮길 수 있는 묶음이 얼마나 커지는지 관찰하면 규칙이 빠르게 익숙해집니다.",
    mobile: "보드 게임은 작은 칸을 잘못 누르지 않도록 착수 전 선택 표시와 상태 문구를 확인합니다. 카드 게임에서는 긴 열을 위아래로 살필 수 있도록 세로 화면이 편하고, 전체 보드를 한 번에 비교하려면 가로 화면이 유리할 수 있습니다. 되돌리기와 힌트는 무작정 반복하기보다 막힌 수의 원인을 확인하는 용도로 사용하세요.",
    records: "대전은 승률만 보지 말고 난이도, 선후공과 무승부 비율을 함께 봐야 합니다. 카드 퍼즐은 이동 수가 적더라도 정리 카드가 늘지 않으면 실질적인 진행이 아닐 수 있습니다. 틱택토는 매치 승수, 사목은 난이도별 연승, 솔리테어와 프리셀은 13·26·52장 정리 구간을 비교하면 판의 흐름을 읽기 쉽습니다.",
    checklist: ["대전형인지 혼자 푸는 카드 퍼즐인지 먼저 고릅니다.", "상대의 다음 한 수 승리 가능성을 내 공격보다 먼저 확인합니다.", "빈 열과 임시칸은 카드를 잠시 두는 곳이 아니라 이동 용량으로 계산합니다.", "힌트를 쓴 뒤에는 추천 수가 어떤 통로를 여는지 확인합니다.", "난이도·선후공·완주 여부가 같은 기록끼리 비교합니다."]
  },
  brain: {
    title: "기억·단어·계산 과제로 나누어 고르기",
    intro: [
      "두뇌 게임이라는 이름 아래에서도 필요한 능력은 서로 다릅니다. 기억 타일은 위치와 짝, 사이먼은 순서, 패턴 기억은 짧게 본 공간 배열, 행맨과 단어 맞추기는 언어 후보 축소, 수학 등산은 제한시간 안의 계산 정확도를 사용합니다.",
      "잘하는 분야의 최고 기록만 반복하기보다 다른 과제를 번갈아 플레이하면 어떤 종류의 정보에서 실수가 생기는지 알기 쉽습니다. 조용히 생각하는 단어 게임, 화면을 잠깐 보고 재현하는 기억 게임, 빠르게 답을 내는 계산 게임 중 현재 집중 상태에 맞는 것을 고르세요."
    ],
    picks: [
      ["hangman", "행맨", "영문·한글 초성", "카테고리와 뜻, 공개된 위치를 조합해 단어 후보를 줄입니다."],
      ["memory-tiles", "기억 타일", "위치·짝 기억", "칸을 구역과 모양으로 묶어 같은 타일의 위치를 찾습니다."],
      ["simon", "사이먼 게임", "순서 기억", "빛과 소리 순서를 짧은 묶음으로 나누어 재현합니다."]
    ],
    rows: [
      ["행맨", "글자·단어 입력", "약 2분", "연승·남은 기회"],
      ["기억 타일", "카드 뒤집기", "약 2분", "이동 수·시간"],
      ["사이먼", "순서대로 터치", "약 2분", "라운드·정확도"],
      ["수학 등산", "정답 입력", "약 1분", "정답·콤보"]
    ],
    choice: "텍스트 힌트를 읽고 후보를 좁히는 과정이 좋으면 행맨과 단어 맞추기가 맞습니다. 시각 정보를 짧게 저장하는 연습은 기억 타일과 패턴 기억, 순서 자체를 이어 붙이는 연습은 사이먼이 적합합니다. 암산 속도를 확인하려면 수학 등산을 선택하되, 어려운 한 문제에 오래 머무르기보다 정확한 풀이 리듬을 유지하세요.",
    practice: "기억 과제는 항목을 하나씩 외우지 말고 중앙·모서리·왼쪽 위처럼 위치를 말로 붙이거나 2~3개 묶음으로 나누세요. 행맨에서는 글자 빈도만 따라가지 말고 단어 길이와 공개 위치, 카테고리를 함께 보고, 한글 초성 모드는 뜻에서 실제 단어 후보를 먼저 만든 뒤 필요한 초성을 선택하는 편이 안정적입니다.",
    mobile: "모바일에서는 기억 단계가 끝나기 전에 화면을 스크롤하지 않도록 게임판을 먼저 화면 안에 맞춥니다. 글자 버튼과 숫자 입력은 최소 44px 터치 영역을 사용하지만 빠르게 연속 누르기보다 선택이 반영됐는지 확인하세요. 집중이 끊겼다면 진행 중 판을 억지로 이어가기보다 같은 난이도에서 새 판으로 비교하는 편이 기록 해석에 낫습니다.",
    records: "기억 게임은 한 번의 최고 단계뿐 아니라 실수 수와 재시도 횟수를 함께 봅니다. 행맨은 점수보다 연승과 남은 실수 기회, 계산 게임은 정답 수와 오답 수, 콤보를 함께 비교하세요. 서로 다른 난이도의 숫자를 직접 비교하지 말고 같은 조건에서 세 번 이상 플레이한 변화로 판단하는 것이 좋습니다.",
    checklist: ["위치, 순서, 단어, 계산 중 어떤 정보를 다루고 싶은지 정합니다.", "기억 항목을 구역이나 2~3개 묶음으로 나눕니다.", "언어 게임은 빈도와 함께 길이·위치·카테고리를 봅니다.", "빠른 오답보다 잠깐 멈춘 정확한 입력을 우선합니다.", "같은 난이도의 실수 수와 평균 도달 단계로 변화를 확인합니다."]
  },
  puzzle: {
    title: "논리·공간·연쇄 방식으로 퍼즐 고르기",
    intro: [
      "퍼즐 게임은 정답을 찾는 방식에 따라 필요한 사고가 크게 달라집니다. 지뢰찾기와 스도쿠는 단서에서 확정 수를 찾고, 2048과 슬라이딩 퍼즐은 빈 공간의 이동 경로를 관리하며, 블록 드롭과 매치3은 현재 수가 만든 낙하와 연쇄를 다음 수까지 연결합니다.",
      "처음 방문했다면 규칙을 이미 아는 게임에서 기록 도전을 시작하는 것이 좋습니다. 숫자 단서를 차분히 읽고 싶으면 지뢰찾기·스도쿠, 짧은 이동으로 보드 전체가 바뀌는 퍼즐은 2048·슬라이딩, 움직이는 조각과 연쇄 효과를 선호하면 블록 드롭·매치3를 선택하세요."
    ],
    picks: [
      ["mines", "지뢰찾기 클래식", "논리 단서 · 5분", "숫자와 닫힌 칸의 관계로 안전 칸과 지뢰를 확정합니다."],
      ["sudoku-mini", "스도쿠 클래식", "후보 제거 · 8분", "행·열·박스 후보를 줄여 확정 숫자를 채웁니다."],
      ["twenty-48", "2048 한판", "공간 합치기 · 3분", "큰 타일을 모서리에 두고 낮은 숫자의 흐름을 정리합니다."]
    ],
    rows: [
      ["지뢰찾기", "클릭·깃발", "약 5분", "진행률·완료 시간"],
      ["스도쿠", "숫자·후보 메모", "약 8분", "입력 수·실수"],
      ["2048", "스와이프·방향키", "약 3분", "최대 타일·점수"],
      ["블록 드롭", "이동·회전·홀드", "약 4분", "삭제 줄·백투백"],
      ["매치3", "교환·스와이프", "약 3분", "스테이지·연쇄"]
    ],
    choice: "확정 정보가 쌓이는 과정을 좋아하면 지뢰찾기와 스도쿠가 적합합니다. 되돌리기와 공간 운영으로 한 판을 오래 유지하고 싶으면 2048, 완성 배열을 향해 빈칸을 순환시키는 문제는 슬라이딩 퍼즐이 맞습니다. 제한 시간보다 제한 이동과 목표 관리가 좋다면 매치3, 실시간 낙하 속도와 배치를 함께 다루고 싶다면 블록 드롭을 고르세요.",
    practice: "논리 퍼즐은 판 전체를 막연히 보지 말고 확정 근거가 있는 행·열·숫자 경계를 따라갑니다. 공간 퍼즐은 목표 타일 하나보다 빈칸이 다음에 어디로 이동할지를 먼저 보고, 연쇄 퍼즐은 바로 지워지는 수와 그 뒤에 떨어질 조각을 함께 예상하세요. 막혔을 때 힌트를 사용했다면 답만 실행하지 말고 왜 그 수가 선택지를 늘리는지 확인합니다.",
    mobile: "스와이프 게임은 페이지 스크롤과 입력이 섞이지 않도록 게임판 안에서 짧고 분명하게 움직입니다. 숫자와 작은 칸이 많은 스도쿠·지뢰찾기는 가로 화면 또는 전체화면으로 칸 크기를 확보하고, 블록 드롭은 화면 버튼과 게임판의 홀드·다음 블록을 함께 볼 수 있는 방향을 선택하세요.",
    records: "퍼즐 기록은 빠른 시간 하나만으로 판단하지 않습니다. 지뢰찾기는 힌트와 실수 없이 연 안전 칸 비율, 스도쿠는 입력 수와 실수, 2048은 최대 타일과 빈칸 유지, 블록 드롭은 삭제 줄과 보드 높이, 매치3는 스테이지와 남은 이동을 함께 봐야 실제 개선점을 찾을 수 있습니다.",
    checklist: ["논리 단서, 공간 이동, 연쇄 중 선호하는 풀이 방식을 고릅니다.", "첫 판은 힌트보다 규칙상 확정되는 수를 직접 찾습니다.", "현재 점수보다 다음 수 뒤에 남을 빈 공간을 확인합니다.", "스와이프와 작은 칸은 전체화면·가로 화면으로 조작 영역을 확보합니다.", "시간뿐 아니라 진행률·최대 타일·삭제 줄·스테이지를 함께 비교합니다."]
  },
  skill: {
    title: "속도보다 측정 기준을 먼저 고르기",
    intro: [
      "순발력·기록 게임은 숫자가 바로 나오지만 서로 측정하는 능력은 다릅니다. 반응속도는 신호를 기다렸다 누르는 시간, 클릭 스프린트는 일정 시간의 반복 입력, 에임 트레이너는 목표 이동과 정확한 클릭, 타이핑 노선은 글자를 정확히 입력하는 속도, 색깔 맞추기는 간섭을 무시한 선택 판단을 봅니다.",
      "기록을 비교하려면 장치와 조건을 고정해야 합니다. 마우스와 터치의 입력 지연, 5초와 20초 클릭의 체력 분배, 짧은 문장과 긴 문장의 타자 리듬은 서로 다르므로 같은 모드에서 여러 번 측정한 평균과 정확도를 기준으로 삼으세요."
    ],
    picks: [
      ["reaction-speed", "반응속도 체크", "평균·중앙값", "5회 또는 10회 신호 반응을 모아 한 번의 우연을 줄입니다."],
      ["click-sprint", "클릭 스프린트", "CPS·버스트", "5·10·20초 동안 전후반 페이스와 최고 1초를 비교합니다."],
      ["typing-sprint", "타이핑 노선", "CPM·정확도", "한국어 역 이름을 입력하며 속도와 오타를 함께 기록합니다."]
    ],
    rows: [
      ["반응속도", "신호 후 1회 입력", "5·10회", "평균·중앙값 ms"],
      ["클릭 스프린트", "반복 클릭·터치", "5·10·20초", "CPS·최고 1초"],
      ["에임 트레이너", "이동 후 정확 클릭", "15~30개", "평균 반응·정확도"],
      ["타이핑 노선", "문자열 입력", "약 2분", "CPM·오타·콤보"]
    ],
    choice: "기다렸다 한 번 누르는 순수 반응을 보고 싶으면 반응속도 체크, 반복 입력의 리듬과 지구력은 클릭 스프린트, 손을 목표까지 옮기는 시각 탐색은 에임 트레이너가 적합합니다. 타이핑 노선은 손가락 속도와 언어 정확도를 함께 보고, 색깔 맞추기는 글자의 의미를 억제하고 실제 색을 판단하는 선택 반응에 가깝습니다.",
    practice: "측정 전 한두 판은 장치와 화면 배치에 적응하는 연습으로 두고 기록 비교에서 제외하세요. 클릭은 손목에 힘을 과하게 주지 말고 일정한 간격을 유지하며, 타이핑은 속도를 올리기 전에 오타가 없는 리듬을 만듭니다. 반응속도에서는 신호를 예상해 미리 누른 부정 출발을 빠른 기록으로 해석하면 안 됩니다.",
    mobile: "모바일 터치는 손가락이 목표를 가릴 수 있으므로 화면을 잡는 손과 입력하는 손의 위치를 일정하게 유지합니다. 브라우저 확대나 화면 회전이 측정 중 발생하지 않도록 전체화면을 사용하고, 같은 기기·방향·손가락으로 측정해야 이전 기록과 비교하기 쉽습니다. 긴 클릭 도전은 손가락과 손목에 불편함이 생기면 즉시 멈추세요.",
    records: "최고 기록만 보면 운 좋은 한 번이 실력처럼 보일 수 있습니다. 반응속도는 평균과 중앙값의 차이, 클릭은 전반과 후반 CPS, 에임과 타이핑은 속도와 정확도를 함께 확인하세요. 세 번 이상 같은 조건으로 측정했을 때 평균이 개선되고 변동 폭이 줄었다면 입력이 안정됐다고 볼 수 있습니다.",
    checklist: ["반응, 반복 입력, 조준, 타자 중 측정할 능력을 하나 고릅니다.", "기기·화면 방향·측정 횟수와 난이도를 고정합니다.", "첫 연습 판은 기록 비교에서 제외합니다.", "최고치와 함께 평균·중앙값·정확도·전후반 페이스를 봅니다.", "손가락이나 손목에 불편함이 생기면 긴 반복 입력을 중단합니다."]
  },
  traditional: {
    title: "타이밍·궤적·타격·순서로 전통놀이 고르기",
    intro: [
      "한판게임의 전통놀이는 같은 게이지에 이름만 바꾼 구성이 아닙니다. 제기차기는 떨어지는 제기를 발 높이에서 다시 띄우고, 투호는 바람을 고려해 각도와 힘으로 화살 궤적을 만들며, 딱지치기는 들린 모서리와 타격점을 선택하고, 공기놀이는 던지기·바닥 돌 줍기·받기를 단계 순서대로 수행합니다.",
      "실제 놀이의 모든 물리와 손기술을 그대로 재현할 수는 없지만, 각 놀이에서 판단이 갈리는 핵심 동작을 서로 다른 입력으로 옮겼습니다. 움직이는 물체에 맞추는 반응, 한 발씩 오차를 보정하는 조준, 위치와 힘의 결합, 여러 행동의 순서 기억 중 원하는 감각으로 고르세요."
    ],
    picks: [
      ["jegi-kick", "제기차기 한판", "낙하 타이밍", "제기의 높이와 좌우 흔들림을 읽어 발등 타격을 이어 갑니다."],
      ["tuho", "투호 한판", "각도·힘·바람", "열 발의 포물선 결과를 보고 다음 화살의 오차를 보정합니다."],
      ["gonggi", "공기놀이 한판", "5단계 순서", "던지고 필요한 돌을 주운 뒤 내려오는 돌을 받아 완주합니다."]
    ],
    rows: [
      ["제기차기", "타이밍 입력", "약 1분", "연속 차기·정확도"],
      ["투호", "각도·힘 조절", "10발", "명중·중심 거리"],
      ["딱지치기", "타격점·힘", "약 2분", "뒤집기·연승"],
      ["공기놀이", "던지기·선택·받기", "5단계", "완주·실수"]
    ],
    choice: "한 번의 정확한 타이밍을 반복하고 싶으면 제기차기, 결과 궤적을 보고 수치를 보정하는 과정은 투호가 잘 맞습니다. 딱지치기는 상대 딱지의 상태를 보고 위치와 힘을 함께 정하며, 공기놀이는 한 번 누르는 속도보다 현재 단계에서 해야 할 행동 순서를 지키는 것이 중요합니다.",
    practice: "제기는 최고점이 아니라 발 높이로 내려오는 순간을 보고, 투호는 한 발의 성공 여부보다 좌우·앞뒤 오차가 어떻게 변했는지 확인하세요. 딱지는 들린 모서리 가까운 타격점과 힘을 함께 조절하고, 공기는 서둘러 받기 전에 필요한 바닥 돌을 모두 주웠는지 상태 문구를 읽는 습관이 중요합니다.",
    mobile: "모바일에서는 전통놀이별 핵심 버튼이 화면 아래에 배치되므로 게임 오브젝트와 버튼을 함께 볼 수 있는 방향을 선택하세요. 투호의 각도와 힘, 딱지의 타격점처럼 두 단계 입력은 첫 선택을 확인한 뒤 다음 입력을 진행합니다. 가로 화면과 전체화면은 궤적과 낙하 높이를 넓게 보는 데 도움이 됩니다.",
    records: "제기차기는 연속 횟수와 정확도, 투호는 명중 수와 중심까지의 거리, 딱지치기는 성공률과 연승, 공기놀이는 완주 단계와 실수를 봅니다. 서로 다른 놀이의 점수를 직접 비교하기보다 같은 난이도에서 실패 원인이 줄고 완주 구간이 늘어나는지를 기준으로 기록을 해석하세요.",
    checklist: ["타이밍, 궤적, 타격점, 행동 순서 중 원하는 조작을 고릅니다.", "첫 판에는 결과 메시지와 오차 표시가 무엇을 뜻하는지 확인합니다.", "힘만 바꾸지 말고 위치·각도·타이밍 중 한 요소씩 보정합니다.", "두 단계 입력은 첫 선택 상태를 확인한 뒤 다음 버튼을 누릅니다.", "점수보다 연속 횟수·거리·성공률·완주 단계를 같은 난이도에서 비교합니다."]
  }
};

function categoryGuideHtml(category) {
  const section = categoryHubGuides[category];
  return `<!-- CATEGORY_QUALITY_GUIDE_START -->
<section class="section category-hub-depth" id="selection-guide">
  <article class="article category-hub-article">
    <p class="eyebrow">Selection guide</p>
    <h2>${section.title}</h2>
    ${section.intro.map((paragraph) => `<p>${paragraph}</p>`).join("\n    ")}
    <div class="category-pick-grid" aria-label="대표 게임 추천">
      ${section.picks.map(([id, title, meta, description]) => `<a class="category-pick" href="/games/${id}/"><img src="/assets/game-art/${id}.webp" width="640" height="360" loading="lazy" alt="${title} 플레이 화면"><span><small>${meta}</small><strong>${title}</strong><b>${description}</b></span></a>`).join("\n      ")}
    </div>
    <h2>조작·플레이 시간·기록 비교</h2>
    <div class="category-table-wrap"><table class="category-comparison"><thead><tr><th scope="col">게임</th><th scope="col">주요 조작</th><th scope="col">한 판 기준</th><th scope="col">볼 기록</th></tr></thead><tbody>${section.rows.map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <h2>나에게 맞는 게임을 고르는 기준</h2>
    <p>${section.choice}</p>
    <h2>첫 기록을 만드는 연습 순서</h2>
    <p>${section.practice}</p>
    <h2>모바일에서 편하게 플레이하기</h2>
    <p>${section.mobile}</p>
    <h2>기록을 해석하는 방법</h2>
    <p>${section.records}</p>
    <h2>시작 전 확인 목록</h2>
    <ul class="strategy-list">${section.checklist.map((item) => `<li>${item}</li>`).join("")}</ul>
  </article>
</section>
<!-- CATEGORY_QUALITY_GUIDE_END -->`;
}

updateFile(path.join("assets", "arcade.js"), (html) => {
  const visibleIds = INDEXABLE_GAME_IDS.map((id) => `"${id}"`).join(", ");
  const flagshipIds = FLAGSHIP_GAME_IDS.map((id) => `"${id}"`).join(", ");
  let next = html.replace(
    /const approval(?:Visible|Hidden)GameIds[\s\S]*?const publicCatalog = [\s\S]*?\n  \}\);/,
    `const approvalVisibleGameIds = new Set([${visibleIds}]);\n  const approvalHiddenGameIds = new Set(catalog\n    .filter(function (game) { return !approvalVisibleGameIds.has(game.id); })\n    .map(function (game) { return game.id; }));\n  const gameById = new Map(catalog.map(function (game) { return [game.id, game]; }));\n  const flagshipGameIds = new Set([${flagshipIds}]);\n  const publicCatalog = [${visibleIds}]\n    .map(function (id) { return gameById.get(id); })\n    .filter(Boolean);`,
  );
  next = next.replace(
    "publicCatalog.forEach(function (game) {\n      const option = document.createElement(\"option\");",
    `const currentGame = catalog.find(function (game) { return game.id === current; });\n    const pickerCatalog = currentGame && approvalHiddenGameIds.has(current)\n      ? [currentGame].concat(publicCatalog)\n      : publicCatalog;\n\n    pickerCatalog.forEach(function (game) {\n      const option = document.createElement(\"option\");`,
  );
  return next;
});

FLAGSHIP_GAME_IDS.forEach((id) => {
  updateFile(path.join("games", id, "index.html"), (html) => {
    let next = html.replace(
      /<main class="([^"]*\bgame-detail-page\b[^"]*)">/,
      (match, classes) => classes.includes("flagship-game-page")
        ? match
        : `<main class="${classes} flagship-game-page">`,
    );
    next = next.replace(/\s*<!-- FLAGSHIP_RECORD_GUIDE_START -->[\s\S]*?<!-- FLAGSHIP_RECORD_GUIDE_END -->\s*/g, "\n\n          ");
    next = next.replace(/\s*<li><a href="#record-challenges">기록 도전<\/a><\/li>/g, "");
    if (next.includes('<li><a href="#faq">FAQ</a></li>')) {
      next = next.replace('<li><a href="#faq">FAQ</a></li>', '<li><a href="#record-challenges">기록 도전</a></li>\n            <li><a href="#faq">FAQ</a></li>');
    }
    if (next.includes('<h2 id="faq">')) {
      return next.replace('<h2 id="faq">', `${flagshipEditorialHtml(flagshipEditorialSections[id])}\n\n          <h2 id="faq">`);
    }
    if (next.includes('<h2>FAQ</h2>')) {
      return next.replace('<h2>FAQ</h2>', `${flagshipEditorialHtml(flagshipEditorialSections[id])}<h2>FAQ</h2>`);
    }
    return next.replace('<h2>업데이트</h2>', `${flagshipEditorialHtml(flagshipEditorialSections[id])}\n    <h2>업데이트</h2>`);
  });
});

Object.keys(categoryHubGuides).forEach((id) => {
  updateFile(path.join("games", id, "index.html"), (html) => {
    let next = html.replace(/\s*<!-- CATEGORY_QUALITY_GUIDE_START -->[\s\S]*?<!-- CATEGORY_QUALITY_GUIDE_END -->\s*/g, "\n");
    const title = next.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, "").trim() || id;
    const canonical = next.match(/<link rel="canonical" href="([^"]+)">/i)?.[1] || `https://hanpangames.kr/games/${id}/`;
    const description = next.match(/<meta name="description" content="([^"]+)">/i)?.[1] || `${title} 선택 가이드`;
    const games = [...next.matchAll(/<a class="featured-link" href="\/games\/([^/]+)\/"><strong>([^<]+)<\/strong>/g)]
      .map((match, index) => ({ id: match[1], title: match[2], position: index + 1 }));
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: title,
          url: canonical,
          description,
          inLanguage: "ko-KR",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: games.length,
            itemListElement: games.map((game) => ({
              "@type": "ListItem",
              position: game.position,
              name: game.title,
              url: `https://hanpangames.kr/games/${game.id}/`,
            })),
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "홈", item: "https://hanpangames.kr/" },
            { "@type": "ListItem", position: 2, name: "게임", item: "https://hanpangames.kr/games/" },
            { "@type": "ListItem", position: 3, name: title, item: canonical },
          ],
        },
      ],
    };
    next = next.replace(
      /<header class="site-header">[\s\S]*?<\/header>/,
      '<header class="site-header"><a class="brand" href="/" aria-label="한판게임 홈"><span class="brand-mark" aria-hidden="true">H</span><span><strong>한판게임</strong><small>HANPAN GAME</small></span></a><nav class="nav" aria-label="주요 메뉴"><a href="/games/" aria-current="page">게임</a><a href="/guides/">가이드</a><a href="/about/">소개</a><a href="/help/">도움말</a><a href="/contact/">문의</a></nav></header>',
    );
    next = next.replace(
      /<footer class="site-footer">[\s\S]*?<\/footer>/,
      '<footer class="site-footer"><div><strong>한판게임</strong><p>설치 없이 즐기는 클래식 웹게임과 실제 플레이 기준 가이드를 제공합니다.</p></div><nav aria-label="사이트 정보"><a href="/about/">소개</a><a href="/help/">도움말</a><a href="/updates/">업데이트</a><a href="/privacy/">개인정보처리방침</a><a href="/terms/">이용약관</a><a href="/contact/">문의</a></nav><p class="copyright">© <span id="year"></span> Hanpan Game. All rights reserved.</p></footer>',
    );
    next = next.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
    );
    return next.replace(/<section class="section">\s*<div class="cards">/, `${categoryGuideHtml(id)}\n<section class="section"><div class="cards">`);
  });
});

const flagshipUpdateEntry = `<!-- FLAGSHIP_CHALLENGE_UPDATE_START -->
        <h2>2026년 9월 4일</h2>
        <h3>대표 게임 15종 기록 도전과 모바일 플레이 개선</h3>
        <p>
          <a href="/games/mines/">지뢰찾기</a>, <a href="/games/card-solitaire/">카드 솔리테어</a>,
          <a href="/games/sudoku-mini/">스도쿠</a>, <a href="/games/twenty-48/">2048</a>,
          <a href="/games/block-drop-classic/">블록 드롭</a>, <a href="/games/brick-break/">벽돌깨기</a>,
          <a href="/games/snake-garden/">뱀의 정원</a>, <a href="/games/freecell-classic/">프리셀</a>,
          <a href="/games/tic-tac-toe/">틱택토</a>, <a href="/games/connect-four/">사목</a>에 게임별 점수판을 읽는 3단계 도전 목표를 추가했습니다.
          이어서 <a href="/games/maze-chase/">미로 추격</a>, <a href="/games/match-three/">매치3</a>,
          <a href="/games/sliding-puzzle/">슬라이딩 퍼즐</a>, <a href="/games/hangman/">행맨</a>,
          <a href="/games/flappy-jump/">플래피 점프</a>에도 실제 규칙에 맞춘 수집·스테이지·정렬·연승·통과 목표를 적용했습니다.
          모바일에서는 점수와 게임판이 먼저 보이도록 선택기와 조작 영역을 압축하고, 각 페이지 본문에 기록을 해석하는 기준과 상황별 목표를 보강했습니다. 게임이 시작되며 화면을 다시 그리는 경우에도 도전 진행이 유지되도록 실행 구조도 개선했습니다.
        </p>
        <!-- FLAGSHIP_CHALLENGE_UPDATE_END -->`;

const categoryUpdateEntry = `<!-- CATEGORY_HUB_UPDATE_START -->
        <h3>장르별 선택 가이드 6종 보강</h3>
        <p>
          <a href="/games/arcade/">고전 오락실</a>, <a href="/games/board/">보드·전략</a>,
          <a href="/games/brain/">두뇌·기억</a>, <a href="/games/puzzle/">퍼즐</a>,
          <a href="/games/skill/">순발력·기록</a>, <a href="/games/traditional/">한국 전통놀이</a> 허브에
          대표 게임 이미지, 조작·플레이 시간·기록 비교표, 초보 선택 기준, 모바일 조작과 기록 해석을 추가했습니다.
          각 허브는 단순 링크 목록이 아니라 장르 안에서 자신에게 맞는 게임을 고를 수 있는 독립 가이드로 제공합니다.
        </p>
        <!-- CATEGORY_HUB_UPDATE_END -->`;

updateFile(path.join("updates", "index.html"), (html) => {
  const next = html
    .replace(/\s*<!-- FLAGSHIP_CHALLENGE_UPDATE_START -->[\s\S]*?<!-- FLAGSHIP_CHALLENGE_UPDATE_END -->\s*/g, "\n        ")
    .replace(/\s*<!-- CATEGORY_HUB_UPDATE_START -->[\s\S]*?<!-- CATEGORY_HUB_UPDATE_END -->\s*/g, "\n        ");
  return next.replace('<article class="article timeline">', `<article class="article timeline">\n        ${flagshipUpdateEntry}\n        ${categoryUpdateEntry}`);
});

const homeGuideCards = [
  ["mines-beginner-guide", "지뢰찾기 기본 규칙", "숫자 힌트로 안전한 칸과 지뢰 후보를 구분합니다."],
  ["sudoku-classic-guide", "스도쿠 입문 공략", "후보 메모와 행·열·박스 교차로 확정 숫자를 찾습니다."],
  ["twenty-48-strategy", "2048 초보 전략", "큰 타일을 모서리에 고정하고 빈칸을 관리합니다."],
  ["brick-break-strategy", "벽돌깨기 초보 공략", "패들 위치와 반사각으로 공을 오래 유지합니다."],
  ["block-drop-beginner", "블록 드롭 초보 가이드", "홀드와 다음 블록을 읽고 보드를 낮게 유지합니다."],
  ["snake-garden-guide", "스네이크 공략", "먹이보다 탈출 공간을 먼저 확인하는 경로 판단을 정리합니다."],
].map(([id, title, text]) => `    <a class="featured-link" href="/guides/${id}/"><strong>${title}</strong><span>${text}</span></a>`).join("\n");

const homeGameCards = [
  ["mines", "blue", "퍼즐", "5분", "지뢰찾기 클래식", "숫자 단서와 깃발을 이용해 지뢰를 피하고 모든 안전 칸을 여세요."],
  ["card-solitaire", "gold", "보드·전략", "8분", "카드 솔리테어", "숨은 카드를 열고 네 개의 완성 탑에 52장을 차례로 정리하세요."],
  ["sudoku-mini", "blue", "퍼즐", "8분", "스도쿠 클래식", "후보 메모와 힌트를 활용해 세 가지 난이도의 9×9 퍼즐을 푸세요."],
  ["twenty-48", "blue", "퍼즐", "3분", "2048 한판", "스와이프와 실행 취소를 활용해 2048 이후의 타일까지 도전하세요."],
  ["block-drop-classic", "blue", "퍼즐", "4분", "블록 드롭 클래식", "홀드와 다음 블록 3개를 활용해 줄 삭제·백투백 기록에 도전합니다."],
  ["brick-break", "red", "고전 오락실", "2분", "벽돌깨기 미니", "패들 위치와 반사각을 조절해 벽돌을 깨고 높은 스테이지에 도전합니다."],
].map(([id, tag, category, minutes, title, text]) => `    <article class="featured-game-card"><a href="/games/${id}/"><img src="/assets/game-art/${id}.webp" width="640" height="360" loading="lazy" alt="${title} 플레이 화면"><div class="featured-game-body"><div class="game-meta"><span class="tag ${tag}">${category}</span><span>${minutes}</span></div><h3>${title}</h3><p>${text}</p><strong>바로 시작</strong></div></a></article>`).join("\n");

const homeHero = `<section class="hero">
    <div class="hero-copy"><p class="eyebrow">15 CLASSIC BROWSER GAMES</p><h1>한판게임</h1><p class="hero-kicker">아는 게임부터, 바로 한 판.</p><p class="lead">지뢰찾기, 솔리테어, 스도쿠, 2048과 블록 드롭을 모바일과 데스크톱에서 설치 없이 즐기세요.</p><div class="hero-actions"><a class="button primary" href="/games/">대표 게임 보기</a><a class="button secondary" href="/games/mines/#play-area">지뢰찾기 시작</a></div></div>
    <div class="hero-game-preview" aria-label="인기 게임 바로가기"><a href="/games/mines/"><img src="/assets/game-art/mines.webp" width="640" height="360" alt="지뢰찾기 클래식 플레이 화면"><span><strong>지뢰찾기</strong><small>숫자 단서 퍼즐</small></span></a><a href="/games/card-solitaire/"><img src="/assets/game-art/card-solitaire.webp" width="640" height="360" alt="카드 솔리테어 플레이 화면"><span><strong>솔리테어</strong><small>클론다이크 카드</small></span></a><a href="/games/sudoku-mini/"><img src="/assets/game-art/sudoku-mini.webp" width="640" height="360" alt="스도쿠 클래식 플레이 화면"><span><strong>스도쿠</strong><small>9×9 논리 퍼즐</small></span></a></div>
  </section>`;

updateFile("index.html", (html) => {
  let next = html.replace(/<section class="hero">[\s\S]*?<\/section>/, homeHero);
  next = filterLinkedBlocks(
    next,
    /\s*<article class="featured-game-card"><a href="\/games\/([^/]+)\/">[\s\S]*?<\/article>/g,
    indexableGameIds,
  );
  next = next.replace(/\s*<section class="section" aria-labelledby="traditionalGamesTitle">[\s\S]*?<\/section>/, "");
  next = next.replace(/\s*<section class="section quick-games-section">[\s\S]*?<\/section>/, "");
  next = next.replace(/\s*<section class="section" aria-labelledby="homeCategoryTitle">[\s\S]*?<\/section>/, "");
  next = next.replace(
    /(<section id="popular-games"[\s\S]*?<div class="featured-game-grid">)[\s\S]*?(<\/div><div class="section-action">)/,
    `$1\n${homeGameCards}\n  $2`,
  );
  next = next.replace(
    /<section class="section"><div class="section-heading"><p class="eyebrow">64 Guides<\/p>[\s\S]*?<\/div><\/section>/,
    `<section class="section"><div class="section-heading"><p class="eyebrow">11 Guides</p><h2>게임 공략과 플레이 기준</h2><p>대표 게임의 실패 원인과 기록 개선 방법을 실제 규칙에 맞춰 정리했습니다.</p></div><div class="featured-link-grid">\n${homeGuideCards}\n    <a class="featured-link" href="/guides/"><strong>핵심 가이드 전체 보기</strong><span>퍼즐·아케이드 공략과 모바일 조작 기준을 한곳에서 확인하세요.</span></a>\n  </div></section>`,
  );
  return next
    .replace("한판게임 - 설치 없이 즐기는 무료 웹게임 45개", "한판게임 - 설치 없이 즐기는 클래식 웹게임")
    .replace("고전 오락실, 퍼즐, 보드, 두뇌, 순발력, 한국 전통놀이까지 무료 웹게임 45개를 설치와 로그인 없이 즐기세요. 64개 공략·선택 가이드와 모바일 조작 안내를 함께 제공합니다.", "지뢰찾기, 스도쿠, 2048, 솔리테어, 벽돌깨기를 설치와 로그인 없이 즐기고 게임별 조작법과 공략을 함께 확인하세요.")
    .replace("한판게임 - 무료 웹게임 45개", "한판게임 - 클래식 웹게임")
    .replace("45개 무료 브라우저 게임과 64개 공략·선택 가이드를 한곳에서 즐기세요.", "엄선한 클래식 브라우저 게임과 실제 플레이 공략을 한곳에서 확인하세요.")
    .replace("45 FREE BROWSER GAMES", "15 CLASSIC BROWSER GAMES")
    .replace("버블 슈터, 오목, 프리셀, 벽돌깨기, 스네이크부터 제기차기와 투호까지. 설치와 로그인 없이 45개 게임을 모바일과 데스크톱에서 무료로 즐기세요.", "지뢰찾기, 스도쿠, 2048, 프리셀, 벽돌깨기, 스네이크를 모바일과 데스크톱에서 설치 없이 즐기세요.")
    .replace("45개 게임 보기", "15개 대표 게임 보기")
    .replace("45 games · 64 guides", "15 games · 11 guides")
    .replace('<span class="tile cool">45</span>', '<span class="tile cool">15</span>')
    .replace('<section class="section stats-band" aria-label="사이트 요약"><div><strong>45</strong><span>즉시 플레이 게임</span></div><div><strong>6</strong><span>게임 카테고리</span></div><div><strong>64</strong><span>공략·선택 가이드</span></div><div><strong>0원</strong><span>설치·로그인 없음</span></div></section>', '<section class="section stats-band" aria-label="사이트 요약"><div><strong>15</strong><span>대표 게임</span></div><div><strong>4</strong><span>핵심 장르</span></div><div><strong>11</strong><span>플레이 가이드</span></div><div><strong>0원</strong><span>설치·로그인 없음</span></div></section>')
    .replace("전체 45개 게임 보기", "대표 게임 전체 보기")
    .replace("무료 웹게임 45개와 플레이 가이드", "클래식 웹게임과 플레이 가이드")
    .replace("무료 웹게임 45개와 플레이 공략을 제공하는", "클래식 웹게임과 플레이 공략을 제공하는")
    .replace("한판게임은 45개 게임을 단순히 나열하지 않고", "한판게임은 규칙과 기록 구조가 분명한 대표 게임을 우선하고")
    .replace(/한판게임은 규칙과 기록 구조가 분명한 대표 게임을 [^.]+./, "한판게임은 규칙과 기록 구조가 분명한 대표 게임을 4개 핵심 장르로 나누어 소개합니다.");
});

const coreGameCards = homeGameCards;

const gamesSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "한판게임 대표 클래식 웹게임",
      url: "https://hanpangames.kr/games/",
      description: "설치 없이 즐기는 대표 클래식 웹게임 15개",
      inLanguage: "ko-KR",
    },
    {
      "@type": "ItemList",
      name: "한판게임 대표 게임",
      numberOfItems: INDEXABLE_GAME_IDS.length,
      itemListElement: INDEXABLE_GAME_IDS.map((id, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://hanpangames.kr/games/${id}/`,
      })),
    },
  ],
});

updateFile(path.join("games", "index.html"), (html) => {
  let next = filterLinkedBlocks(
    html,
    /\s*<a class="featured-link" href="\/games\/([^/]+)\/">[\s\S]*?<\/a>/g,
    indexableGameIds,
  );
  next = next.replace(
    /<section class="featured-games" aria-label="대표 심화 게임">[\s\S]*?<\/section>/,
    `<section class="featured-games" aria-label="인기 대표 게임"><div class="section-heading"><p class="eyebrow">Popular classics</p><h2>많이 찾는 게임부터 시작하기</h2><p>규칙이 익숙하고 반복해서 기록에 도전하기 좋은 대표 게임입니다.</p></div><div class="featured-game-grid">\n${coreGameCards}\n  </div></section>`,
  );
  next = next.replace(/\s*<section class="section"><div class="section-heading"><p class="eyebrow">Quick picks<\/p>[\s\S]*?<\/section>/, "");
  next = next.replace(
    /<section class="section" aria-labelledby="categoryTitle">[\s\S]*?<\/section>/,
    `<section class="section library-category-section" aria-labelledby="categoryTitle"><div class="section-heading"><p class="eyebrow">Categories</p><h2 id="categoryTitle">4개 핵심 장르로 찾기</h2><p>아케이드, 퍼즐, 보드·전략, 두뇌 게임을 필터로 빠르게 고를 수 있습니다.</p></div><div class="category-showcase"><a class="category-jump" style="--category-color:#df4b38" href="#game-library" data-arcade-jump="arcade"><i aria-hidden="true">오</i><span><strong>고전 오락실</strong>벽돌·미로·스네이크 4개</span></a><a class="category-jump" style="--category-color:#2877b9" href="#game-library" data-arcade-jump="puzzle"><i aria-hidden="true">퍼</i><span><strong>퍼즐</strong>논리·배치·연쇄 6개</span></a><a class="category-jump" style="--category-color:#c88b19" href="#game-library" data-arcade-jump="board"><i aria-hidden="true">보</i><span><strong>보드·전략</strong>카드·대전 4개</span></a><a class="category-jump" style="--category-color:#258b62" href="#game-library" data-arcade-jump="brain"><i aria-hidden="true">두</i><span><strong>두뇌·단어</strong>단어 추리 1개</span></a></div></section>`,
  );
  next = next.replace(
    /(<section class="section library-category-section"[\s\S]*?<\/section>)\s*(<section class="featured-games"[\s\S]*?<\/section>)/,
    `$2\n\n  $1`,
  );
  next = next.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${gamesSchema}</script>`,
  );
  return next
    .replace("한판게임의 무료 웹게임 45개 전체 목록입니다. 한국 전통놀이 4개, 고전 오락실 12개, 퍼즐 11개, 보드·전략 6개, 두뇌·기억 6개, 순발력·기록 6개를 확인하세요.", "한판게임이 엄선한 클래식 웹게임 15개입니다. 아케이드, 퍼즐, 보드·전략, 두뇌 장르를 설치 없이 즐기세요.")
    .replace("무료 웹게임 45개 전체 목록 - 한판게임", "클래식 웹게임 15개 - 한판게임")
    .replace("45개 무료 브라우저 게임을 6개 장르로 나눠 검색하고 바로 플레이하세요.", "15개 대표 브라우저 게임을 4개 핵심 장르로 나눠 검색하고 바로 플레이하세요.")
    .replace("무료 웹게임 45개 전체 목록", "대표 클래식 웹게임 15개")
    .replace("검색과 필터로 빠르게 고르거나, 아래 6개 카테고리 전용 페이지에서 장르별 게임과 추천 기준을 먼저 확인하세요.", "검색과 필터로 게임을 빠르게 고르고 각 상세 페이지에서 조작법과 점수 기준을 확인하세요.")
    .replace("설치 없이 바로 즐기는 설치 없이 바로 즐기는 클래식 웹게임.", "설치 없이 바로 즐기는 클래식 웹게임.")
    .replace('<button type="button" class="filter" data-arcade-filter="traditional">한국 전통놀이</button>', "")
    .replace('<button type="button" class="filter" data-arcade-filter="skill">순발력·기록</button>', "")
    .replace('"description":"무료 웹게임 45개 전체 목록"', '"description":"엄선한 클래식 웹게임 15개"')
    .replace(/45개 게임/g, "15개 대표 게임")
    .replace("전체 게임 목록", "대표 게임 목록")
    .replace("무료 웹게임 45개 전체 목록", "엄선한 클래식 웹게임 목록")
    .replace("무료 웹게임 45개.", "설치 없이 바로 즐기는 클래식 웹게임.")
    .replace("45개 게임을 고르는 기준", "대표 게임을 고르는 기준")
    .replace("49개 가이드", "핵심 가이드");
});

const ticTacToeExtraContent = `<h2>한 판을 시작하는 순서</h2><p>처음에는 AI 대전 또는 2인 대전을 고르고, AI 대전이라면 난이도와 선공을 선택합니다. 설정을 바꾸면 새 매치가 시작되며 X와 O의 매치 점수는 0으로 돌아갑니다. 내가 선공을 선택하면 첫 수를 바로 둘 수 있고, 상대 선공을 선택하면 AI가 먼저 둔 뒤 내 차례가 됩니다. 현재 차례와 내가 맡은 기호는 보드 위 상태표에서 확인할 수 있습니다.</p><h2>보드 위치 읽기</h2><p>숫자키는 키패드가 아니라 읽기 순서대로 배치됩니다. 1·2·3은 위쪽 줄, 4·5·6은 가운데 줄, 7·8·9는 아래쪽 줄입니다. 중앙 5번은 가로·세로·두 대각선에 모두 참여하므로 가장 많은 승리 경로를 가집니다. 네 모서리는 각각 세 개의 승리 경로에 참여하고, 변의 가운데 칸은 두 개의 경로에 참여합니다. 빈 칸 버튼에는 위치가 음성으로 안내되어 화면 읽기 프로그램으로도 현재 보드를 탐색할 수 있습니다.</p><h2>선공과 후공 운영</h2><p>선공이라면 중앙이나 모서리에서 시작해 서로 다른 두 줄에 동시에 참여할 수 있는 기반을 만드는 것이 안정적입니다. 후공인데 상대가 중앙을 차지했다면 모서리로 대응하고, 상대가 모서리에서 시작했다면 중앙을 확보하는 방식이 기본입니다. 다만 정해진 첫 수만 반복하기보다 매 차례 즉시 승리할 칸과 상대가 다음 수에 완성할 칸을 먼저 확인해야 합니다.</p><h2>포크를 찾는 실제 순서</h2><p>포크는 다음 차례에 완성할 수 있는 두 줄을 동시에 만드는 배치입니다. 먼저 내 돌 두 개로 즉시 완성되는 줄이 있는지 보고, 없다면 상대의 즉시 승리를 막습니다. 그 다음 내가 한 수로 두 개의 위협을 만들 수 있는 칸을 찾고, 상대에게 같은 기회가 생기는지도 확인합니다. 공격 모양만 따라가다가 상대의 한 줄 완성을 놓치는 경우가 가장 흔하므로 이 확인 순서를 매번 유지하는 편이 좋습니다.</p><h2>난이도별 연습 목표</h2><p>쉬움에서는 여러 첫 수를 시험하며 가로·세로·대각선 모양을 익힐 수 있습니다. 보통은 유리한 수를 계산하지만 선택에 변동성이 있어 포크와 차단을 연습하기 좋습니다. 어려움은 가능한 후속 수를 끝까지 평가하므로 실수하지 않으면 무승부에 도달합니다. 어려움에서 연속 무승부를 기록했다면 기본 방어 순서가 안정됐다는 뜻이며, 쉬움과 보통에서 승리 기회를 더 빠르게 찾는 연습으로 이어갈 수 있습니다.</p><h2>기록을 읽는 방법</h2><p>승·무·패는 선택한 모드와 난이도별로 따로 쌓입니다. 한 번의 매치에는 여러 판이 포함되므로 게임 수와 매치 수는 서로 다를 수 있습니다. 단판 승률만 보기보다 어려움에서 패배 없이 마친 판의 비율, 보통에서 3승에 도달하기까지 치른 판 수, 선후공을 바꿨을 때의 체감 차이를 함께 확인하면 실력이 어떻게 변하는지 더 분명하게 볼 수 있습니다.</p><h2>모바일과 키보드 플레이</h2><p>모바일에서는 화면을 세로 또는 가로로 돌려도 보드 비율이 유지됩니다. 빈 칸을 한 번 터치하면 착수하며 빠르게 여러 번 눌러도 이미 채워진 칸에는 다시 둘 수 없습니다. 데스크톱에서는 숫자키 1부터 9까지로 원하는 칸을 선택할 수 있고, N 키로 새 매치를 시작합니다. 한 판이 끝났지만 아직 어느 쪽도 3승에 도달하지 않았다면 Enter 키로 다음 판을 시작할 수 있습니다.</p>`;

updateFile(path.join("games", "tic-tac-toe", "index.html"), (html) => {
  if (html.includes("한 판을 시작하는 순서")) return html;
  return html.replace(
    "<h2>업데이트</h2><p>2026년 8월 27일 실제 런타임 기준으로 3선승 표시, AI 설명, 숫자키와 기록 안내를 교정했습니다.</p>",
    `${ticTacToeExtraContent}<h2>업데이트</h2><p>2026년 8월 27일 실제 런타임 기준으로 3선승 표시, AI 설명, 숫자키와 기록 안내를 교정했습니다. 2026년 9월 4일에는 선후공 운영, 보드 위치, 포크 확인 순서와 기록 해석 설명을 보강했습니다.</p>`,
  );
});

updateFile(path.join("guides", "index.html"), (html) => {
  const next = filterLinkedBlocks(
    html,
    /\s*<a class="featured-link" href="\/guides\/([^/]+)\/">[\s\S]*?<\/a>/g,
    indexableGuideIds,
  );
  return next
    .replace("한판게임의 64개 게임 공략·플레이 가이드입니다. 무료·클래식·간단 조작·키보드·마우스·터치 웹게임 추천부터 숫자·수학, 논리·추리, 기억력, 집중력·주의력, 단어, 아케이드, 한국 전통놀이, 보드·카드, 퍼즐, 반응속도, 두뇌 게임 추천과 개별 전략을 안내합니다.", "한판게임의 11개 핵심 플레이 가이드입니다. 지뢰찾기, 스도쿠, 2048, 벽돌깨기, 블록 드롭, 스네이크의 규칙과 실패 원인을 정리합니다.")
    .replace(/64개 가이드/g, "11개 핵심 가이드")
    .replace("실제 플레이 규칙, 기록 방식과 실패 원인을 기준으로 정리한 독립 공략과 장르별 선택 가이드입니다.", "대표 게임의 실제 규칙, 기록 방식과 실패 원인을 기준으로 정리한 핵심 공략입니다.")
    .replace(/<article class="article">[\s\S]*?<\/article>/, '<article class="article"><h2>퍼즐은 실패한 순간을 복기합니다</h2><p>지뢰찾기는 숫자 단서를 잘못 읽은 칸, 2048은 큰 타일이 모서리에서 빠져나온 수, 스도쿠는 후보를 제거하지 못한 구간을 찾으면 다음 판의 판단을 바꿀 수 있습니다.</p><h2>아케이드는 다음 위치를 먼저 봅니다</h2><p>벽돌깨기는 패들의 현재 위치보다 공이 내려올 지점을 예측하고, 스네이크는 먹이보다 몸이 돌아나갈 공간을 먼저 확인하면 기록을 안정적으로 늘릴 수 있습니다.</p></article>');
});

console.log("Curated approval navigation around the reviewed games and guides.");
