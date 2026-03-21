export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-4">
      <div className="max-w-5xl mx-auto text-sm leading-7">
        <p className="text-white font-semibold text-base mb-3">챙겨드림</p>
        <p>대표: 김태용</p>
        <p>사업자등록번호: 572-13-01687</p>
        <p>주소: 부산 동구 성남오길 23번길 14-2</p>
        <p>통신판매업 신고</p>
        <p className="mt-6 text-gray-500">
          &copy; {new Date().getFullYear()} 챙겨드림. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
