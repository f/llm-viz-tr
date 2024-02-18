import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough08_Transformer(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Transformer) {
        return;
    }

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));

    let c0 = commentary(wt, null, 0)`

İşte karşınızda tamamlanmış bir dönüştürücü (transformer) blok!

Bu bloklar, herhangi bir GPT modelinin çoğunu oluşturur ve birkaç kez tekrarlanır, bir bloğun çıktısı
kalıntı yolunu devam ettirerek bir sonraki bloğu besler.

Derin öğrenme alanında çok yaygın bir görüş odur ki, bu katmanların her birinin tam olarak ne yaptığını söylemek çok zor, ancak
genel fikirlere sahibiz: daha erken katmanlar genellikle düşük seviyeli özellikleri ve desenleri öğrenmeye odaklanırken,
daha sonraki katmanlar tanımayı ve anlamayı öğrenir daha yüksek seviye ise soyutlamaları ve ilişkileri.
Doğal dil işleme bağlamında, alt katmanlar dilbilgisi, sözdizimi ve basit kelime ilişkilerini öğrenebilirken,
üst katmanlar daha karmaşık anlamsal ilişkileri, söylem yapılarını ve bağlama bağlı anlamları yakalayabilirler.
`;

}
