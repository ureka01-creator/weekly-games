# 작은 세계 탐험가

어린이를 위한 세계지도·나라·국기 백과사전. GitHub Pages에서 `world-atlas/`로 열립니다.

- 기본 195개국(UN 회원 193 + 교황청/바티칸시국·팔레스타인)
- 추가 나라·지역 포함 250개 항목, 실제 SVG 국기 250개 내장
- 국경 선택, 지도 확대·축소·드래그, 소국 원형 마커, 나라 위치 찾기
- 한국어·영어 검색, 대륙 필터, 무작위 여행지
- 수도·언어·통화·지역, 주요 나라의 어린이 설명 및 국기 모양 설명
- 한국어 음성 읽기(기기 Web Speech 지원 필요)
- 브라우저 localStorage 탐험 도장/여권. 개인정보·서버 저장 없음
- 모바일·태블릿 대응, 키보드 나라 선택

정적 HTML/CSS/JS이며 빌드나 외부 API가 필요 없습니다. 지도·기본 정보·국기는 모두 로컬에 포함되어 있습니다. HTTP 정적 서버에서 폴더를 열면 됩니다.

기본 국가 195개 판정은 데이터의 `unMember` 필드에 의존하지 않고, 해당 필드의 교황청 예외를 바로잡아 PS·VA를 옵서버로 분류합니다. 지도는 경위도 평면도로 면적 비교에 적합하지 않습니다. 분쟁 국경의 공식 기준으로 사용하지 않습니다. 수도와 국기는 정치적·행정적 변화에 따라 별도 확인이 필요합니다. 설명은 초기 어린이용 요약이며 250곳 모두의 상세 문화·역사와 국기의 상징 해설까지 포함하지는 않습니다.

## 출처와 라이선스

- [mledoze/countries](https://github.com/mledoze/countries): 나라 이름/좌표/수도/언어/통화/면적 자료, ODbL. `data.js`는 해당 데이터의 축약·한국어 이름 교정본이며 ODbL 조건으로 제공됩니다.
- [datasets/geo-countries](https://github.com/datasets/geo-countries): Natural Earth 기반 공개 지리 자료, `map.js`는 윤곽을 단순화한 지도입니다.
- [lipis/flag-icons](https://github.com/lipis/flag-icons): SVG 국기. MIT, Copyright (c) 2013-2026 Panayiotis Lipiridis. 라이선스 원문은 `THIRD_PARTY_LICENSES.txt`를 참조하세요.
- [UN 회원국](https://www.un.org/about-us/member-states), [옵서버 국가](https://www.un.org/en/about-us/non-member-states).

2026-11-01 첫 버전.
