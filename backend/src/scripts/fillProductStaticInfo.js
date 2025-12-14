// backend/src/scripts/fillProductStaticInfo.js
// 모든 상품에 동일한 details/sustainability/care/shippingReturn을 일괄로 채우는 스크립트

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const MONGODB_URI = process.env.MONGODB_URI;

const payload = {
    details: {
        description:
            "지속 가능한 방법으로 얻은 유칼립투스 섬유로 만든 니트 어퍼가 실크처럼 부드럽고 쾌적한 착화감을 선사합니다.",
        usages: [
            "사계절 데일리 스니커즈",
            "가벼운 워킹, 출퇴근/주말 외출에 적합",
        ],
        temperatureControl:
            "가벼운 유칼립투스 섬유가 열과 습기를 빠르게 배출해 오래 신어도 발을 쾌적한 온도로 유지해 줍니다.",
        design:
            "군더더기 없는 심플한 실루엣으로 비즈니스 캐주얼부터 주말 캐주얼룩까지 자연스럽게 어울립니다.",
        madeIn: ["베트남", "중국"], // 원문: 베트남/중국
    },

    sustainability: {
        carbonFootprintKgCO2e: 4.99,
        description:
            "Tree Runner의 탄소 발자국은 4.99 kg CO2e입니다.\n" +
            "탄소 발자국 표시와 탄소 배출량 저감을 위한 노력을 통해 올버즈는 Climate Neutral에서 탄소 중립 기업 인증을 획득했으며, 탄소 저감 프로젝트 펀딩을 비롯한 지속 가능한 활동을 통해 탄소 중립을 실현합니다.\n" +
            "지속 가능한 소재:",
        sustainableMaterials: [
            "FSC 인증 TENCEL™ Lyocell (유칼립투스 나무 섬유) 어퍼",
            "사탕수수 기반의 그린 EVA를 사용한 SweetFoam® 미드솔",
            "바이오나일론 신발끈 구멍",
            "플라스틱 페트병을 재활용한 신발 끈",
            "캐스터 빈 인솔",
        ],
    },

    care: {
        instructions: [
            "신발 끈을 신발에서 분리해주세요.",
            "깔창을 신발에서 분리하여 신발과 같이 세탁망(베개 커버도 가능)에 넣어주세요.",
            "세탁기 사용 시 찬물/울 코스로 중성세제를 적당량 첨가하여 세탁해 주시기 바랍니다.",
            "세탁 후에 남은 물기는 털어주시고 자연 건조해 주세요.",
            "1-2회 착용 후 원래 모양으로 곧 돌아오니 걱정하지 않으셔도 됩니다.",
            "더 새로운 경험을 원하시면 새로운 인솔과 신발 끈으로 교체하세요.",
        ],
        tips: [
            "건조기 사용은 피해주세요.",
            "세탁 후에 원래 모양으로 곧 돌아오니 걱정 마세요.",
            "신발 끈과 인솔은 손세탁 하셔도 됩니다.",
        ],
    },

    shippingReturn: {
        description:
            "5만원 이상 무료 배송과 함께, 세일 제품도 7일 이내 미착용 시 교환·환불이 가능합니다. 아래에서 자세한 배송 및 반품 안내를 확인하세요.",
        memberPolicy:
            "회원: 무료 배송 & 30일 내 무료 교환/환불 (단, 세일 제품은 7일 내 미착용 시 교환/환불)",
        nonMemberPolicy: "비회원: 7일 내 미착용 시 교환/환불",
        returnPolicy:
            "반품: 물류센터에 반송품이 도착한 뒤 5 영업일 내 검수 후 환불",
        exchangePolicy:
            "교환: 동일 가격의 상품으로만 교환 가능, 맞교환 불가, 물류센터에 반송품이 도착한 뒤 새로운 교환 상품 발송 (교환 일정 7~10 영업일 소요)",
    },
};

async function main() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI가 없습니다. .env를 확인하세요.");
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB 연결 성공");

    // 이미 값이 있든 없든 전부 동일하게 덮어쓰기
    const result = await Product.updateMany({}, { $set: payload });

    console.log(`✅ 업데이트 완료: matched=${result.matchedCount}, modified=${result.modifiedCount}`);

    await mongoose.disconnect();
    console.log("✅ 연결 종료");
}

main().catch((err) => {
    console.error("❌ 스크립트 실행 실패:", err);
    process.exit(1);
});
