import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough05_Softmax(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Softmax) {
        return;
    }

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));

    let c0 = commentary(wt, null, 0)`

Softmax işlemi, önceki bölümde görüldüğü gibi, hem öz-dikkat kısmının bir parçası olarak kullanılır hem de
modelin en sonunda tekrar karşımıza çıkar.

Bu işlemin bir vektörü alıp değerlerini toplamları 1.0 olacak şekilde normalize etmektir.
Ancak bu işlem toplamlara bölme işlemi yapmak kadar basit bir işlem değil.
Bunun yerine, her girdi değeri önce üssel olarak ifade edilir.

  a = exp(x_1)

Bu işlem tüm değerlerin pozitif olmasını sağlar. Üssel olarak ifade edilen değerlerden oluşan bir vektörümüz
olduğunda, artık her bir değeri tüm değerlerin toplamına bölebiliriz. Bu, değerlerin toplamının 1.0 olmasını sağlar.
Artık tüm üssel değerler de pozitif olduğundan, elde edilen değerlerin 0.0 ile 1.0 arasında olacağından da emin olmuş oluyoruz.
Bu da orijinal değerler üzerinde bir olasılık dağılımı sağlar.

Kısacası Softmax şu: değerleri sadece üssel olarak ifade et ve sonra da toplama böl.

Ancak, ufak bir karmaşıklık var. Girdi değerlerinden herhangi biri çok büyükse, üssel değerler de çok büyük olacaktır.
Bu yüzden çok büyük bir sayıyı çok daha büyük bir sayıya böleceğiz ve bu da çok bilinen
_kayan nokta aritmetiğiyle_ ilgili sorunlara neden olabilir.

Softmax işleminin yararlı bir özelliği şu: Tüm girdi değerlerine sabit bir sayı eklersek, sonucun yine de aynı olmasıdır.
Bu sayede, basitçe girdi vektöründeki en büyük değeri bulabilir ve tüm değerlerden çıkarabiliriz. Bu işlem en büyük
değerin 0.0 olduğundan ve softmax'in sayısal olarak stabil kaldığından da emin olur.

Öz-dikkat katmanının bağlamında softmax işlemine bir göz atalım. Her softmax işlemi için girdi
vektörümüz, öz-dikkat matrisinin de bir satırıdır (ancak sadece diyagonaline kadar).

Katman normalleştirmesinde olduğu gibi, süreci verimli tutmak için bazı toplama değerlerini sakladığımız ara bir adımımız daha var.

Her satır için, satırdaki maksimum değeri ve kaydırılmış & üssel olarak ifade edilen değerlerin toplamını saklarız.
Sonra, karşılık gelen çıktı satırını üretmek için küçük bir işlem seti gerçekleştirebiliriz: En büyük değeri çıkar, üssel hale çevir ve toplama böl.

Peki bu "softmax" adı nereden geliyor? Bu işlemin "sert" versiyonu olan argmax, sadece
maksimum değeri bulur, onu 1.0 olarak ayarlar ve diğer tüm değerlere de 0.0 atar. Bunun aksine, softmax
işlemi, bunun daha "yumuşak" bir versiyonu olarak hizmet eder. Softmax'ta yer alan üssel işlem nedeniyle,
en büyük değer vurgulanır ve 1.0'a doğru itilirken, tüm giriş değerleri üzerinde bir olasılık dağılımını da
korumuş olur. Bu sadece en olası seçeneği değil, aynı zamanda diğer seçeneklerin göreceli olasılığını da
yakalayan daha nüanslı bir temsil sağlar.
`;

}
