import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough09_Output(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Output) {
        return;
    }

    setInitialCamera(state, new Vec3(-20.203, 0.000, -1642.819), new Vec3(281.600, -7.900, 2.298));

    let c0 = commentary(wt, null, 0)`

En sonunda, modelin sonuna geldik. Son dönüştürücü bloğun çıktısı bir katman normalleştirmesinden geçirilir ve sonra
bir doğrusal dönüşüm (matris çarpımı) kullanılır, bu sefer sapma kullanılmaz.

Bu son dönüşüm, her bir sütun vektörümüzü C uzunluğundan nvocab uzunluğuna taşır. Dolayısıyla,
etkin bir şekilde her bir sütunumuz için _kelime dağarcığındaki_ her kelime için bir puan üretiyor. Bu
puanların ise özel bir adı vardır: Lojitler.

"Lojitler" adı, "log-odss" yani, her tokenin şansının logaritması anlamından gelir. "Log" kelimesi
kullanılır çünkü sonraki adımda uyguladığımız softmax, bunları "şans" veya olasılıklara dönüştürmek için üs alır.

Bu puanları güzel olasılıklara dönüştürmek içinse, onları yine bir softmax işleminden geçiririz. Artık her
sütun için, modelin kelime dağarcığındaki her kelimeye atadığı bir olasılığımız var.

Bu model örneğinde, üç harfi nasıl sıralayacağının tüm cevaplarını etkin bir şekilde öğrenmiş, bu yüzden
olasılıklar doğru cevaba ağırlıklı bir şekilde dağılmıştır.

Modeli zamansal olarak adım adım ilerletirken, son sütunun olasılıklarını kullanarak
dizimize ekleyeceğimiz bir sonraki tokeni belirleriz. Örneğin, modele altı token girdiysek,
6'ıncı sütunun çıktı olasılıklarını kullanırız.

Bu sütunun çıktısı bir dizi olasılıktır. Ve bizim aslında bunlardan birini dizinin bir sonraki adımı olarak kullanmak
için seçmemiz gerekiyor. Bu işlemi de "dağılımdan örnekleme" yaparak gerçekleştiririz.
Yani, aslında rastgele bir token seçeriz, fakat bu seçim olasılığına göre ağırlıklıdır.
Örneğin, 0.9 olasılığa sahip bir token, %90 ihtimalle seçilecektir.

Ancak burada başka seçenekler de var, mesela "her zaman en yüksek olasılığa sahip tokeni seçmek" gibi.

Dağılımın "düzgünlüğünü" kontrol etmek için bir sıcaklık (temperature) parametresi kullanabiliriz.
Daha yüksek bir sıcaklık, dağılımı daha düzgün yaparken, daha düşük bir sıcaklık, seçme işlemini
en yüksek olasılığa sahip tokenlara daha fazla yoğunlaştıracaktır.

Bu işlemi de softmax'i uygulamadan önce lojitleri (doğrusal dönüşümün çıktısı) sıcaklık değerine (temperature)
bölerek yaparız. Softmax'ta üs almanın büyük sayılarda büyük bir etkisi olduğundan, hepsini birbirine daha yakın
hale getirmek bu etkiyi azaltır.
`;

}
