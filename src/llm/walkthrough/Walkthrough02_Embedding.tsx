import { duplicateGrid, splitGrid } from "../Annotations";
import { getBlockValueAtIdx } from "../components/DataFlow";
import { IBlkDef } from "../GptModelLayout";
import { drawText, IFontOpts, measureText } from "../render/fontRender";
import { lerp } from "@/src/utils/math";
import { Mat4f } from "@/src/utils/matrix";
import { Dim, Vec3, Vec4 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, DimStyle, IWalkthroughArgs, moveCameraTo, setInitialCamera } from "./WalkthroughTools";
import { processUpTo, startProcessBefore } from "./Walkthrough00_Intro";

export function walkthrough02_Embedding(args: IWalkthroughArgs) {
    let { walkthrough: wt, state, tools: { c_str, c_blockRef, c_dimRef, afterTime, cleanup, breakAfter }, layout } = args;
    let render = state.render;

    if (wt.phase !== Phase.Input_Detail_Embedding) {
        return;
    }

    setInitialCamera(state, new Vec3(15.654, 0.000, -80.905), new Vec3(287.000, 14.500, 3.199));
    wt.dimHighlightBlocks = [layout.idxObj, layout.tokEmbedObj, layout.posEmbedObj, layout.residual0];

    commentary(wt)`
Daha önce, tokenlerin basit bir _başvuru tablosu_ kullanılarak nasıl bir tam sayı dizisine eşlendiğini görmüştük.
Bu tam sayılar, ${c_blockRef('_token indeksleri_', state.layout.idxObj, DimStyle.TokenIdx)}, modelde gördüğümüz _ilk ve tek_ tam sayılardır.
Bundan sonra her zaman ondalık sayılar olan floatları kullanıyoruz.

Şimdi, 4. tokenin (indeksi 3) ${c_blockRef('_girdi gömme_', state.layout.residual0)}'mizin, 4'üncü sütun vektörünü üretmek için nasıl kullanıldığına bir göz atalım.`;
    breakAfter();

    let t_moveCamera = afterTime(null, 1.0);
    let t0_splitEmbedAnim = afterTime(null, 0.3);

    breakAfter();

    commentary(wt)`
Token indeksini (bu durumda ${c_str('B', DimStyle.Token)} = ${c_dimRef('1', DimStyle.TokenIdx)}) sol taraftaki ${c_blockRef('_token gömme matrisi_', state.layout.tokEmbedObj)}'nin 2. sütununu seçmek için kullanıyoruz.
Burada 0 tabanlı indeksleme kullandığımızı unutmayın, yani ilk sütun 0 indeksindedir.

Bu, ${c_dimRef('_C_ = 48', DimStyle.C)} boyutunda bir sütun vektörü üretir, bunu _token gömmesi_ olarak tanımlıyoruz.
    `;
    breakAfter();

    let t1_fadeEmbedAnim = afterTime(null, 0.3);
    let t2_highlightTokenEmbed = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
Ve 4. _pozisyonda_ (t = ${c_dimRef('3', DimStyle.T)}) olduğumuz için ${c_str('B', DimStyle.Token)} tokenimize bakarken, ${c_blockRef('_pozisyon gömme matrisi_', state.layout.posEmbedObj)}'nin 4. sütununu alacağız.

Bu da aynı şekilde ${c_dimRef('_C_ = 48', DimStyle.C)} boyutunda bir sütun vektörü üretir, bunu _pozisyon gömmesi_ olarak tanımlıyoruz.
    `;
    breakAfter();

    let t4_highlightPosEmbed = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
Bu pozisyon ve token gömmelerinin her ikisinin de eğitim sırasında öğrenildiğini unutmayın (mavi renklerle belirtilmiştir).

Şimdi bu iki sütun vektörüne sahip olduğumuza göre, basitçe onları bir araya getirerek ${c_dimRef('_C_ = 48', DimStyle.C)} boyutunda başka bir sütun vektörü üretiriz.
    `;

    breakAfter();

    let t3_moveTokenEmbed = afterTime(null, 0.8);
    let t5_movePosEmbed = afterTime(null, 0.8);
    let t6_plusSymAnim = afterTime(null, 0.8);
    let t7_addAnim = afterTime(null, 0.8);
    let t8_placeAnim = afterTime(null, 0.8);
    let t9_cleanupInstant = afterTime(null, 0.0);
    let t10_fadeAnim = afterTime(null, 0.8);

    breakAfter();

    commentary(wt)`
Şimdi, giriş dizisindeki tüm tokenler için aynı süreci çalıştırıyoruz ve böylece hem token değerlerini hem de pozisyonlarını içeren bir vektör kümesi oluşturmuş oluyoruz.
`;

    breakAfter();

    let t11_fillRest = afterTime(null, 5.0);

    breakAfter();

    commentary(wt)`
${c_blockRef('_girdi gömme_', state.layout.residual0)} matrisindeki bireysel hücrelerin üzerine gelerek hesaplamaları ve kaynaklarını inceleyin.

Girdi dizisindeki tüm tokenler için bu süreci işlettiğimizde, ${c_dimRef('_T_', DimStyle.T)} x ${c_dimRef('_C_', DimStyle.C)} boyutunda bir matris ürettiğimizi görüyoruz.
${c_dimRef('_T_', DimStyle.T)}, ${c_dimRef('_zaman_', DimStyle.T)} anlamına geliyor, yani, dizide daha sonra gelen tokenleri zaman içinde daha sonra olarak düşünebilirsiniz.
${c_dimRef('_C_', DimStyle.C)} ise ${c_dimRef('_kanal_', DimStyle.C)} anlamına geliyor ("özellik" ya da "boyut" ya da "gömme boyutu" olarak da adlandırılır). Bu uzunluk, yani ${c_dimRef('_C_', DimStyle.C)},
modelin birkaç "hiperparametresinden" biridir ve tasarımcı tarafından model boyutu ve performans arasındaki bir denge olarak seçilir.

Bu matris, ${c_blockRef('_girdi gömme_', state.layout.residual0)} olarak adlandıracağımız, artık modelden aşağıya geçmeye hazır hale gelmiştir.
Bu ${c_dimRef('T', DimStyle.T)} sütun koleksiyonu, her biri ${c_dimRef('C', DimStyle.C)} uzunluğunda, bu rehber boyunca tanıdık bir görünüm haline gelecek.
    `;

    cleanup(t9_cleanupInstant, [t3_moveTokenEmbed, t5_movePosEmbed, t6_plusSymAnim, t7_addAnim, t8_placeAnim]);
    cleanup(t10_fadeAnim, [t0_splitEmbedAnim, t1_fadeEmbedAnim, t2_highlightTokenEmbed, t4_highlightPosEmbed]);

    moveCameraTo(state, t_moveCamera, new Vec3(7.6, 0, -33.1), new Vec3(290, 15.5, 0.8));

    let residCol: IBlkDef = null!;
    let exampleIdx = 3;
    if ((t0_splitEmbedAnim.t > 0.0 || t10_fadeAnim.t > 0.0) && t11_fillRest.t === 0) {
        splitGrid(layout, layout.idxObj, Dim.X, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4.0);

        layout.residual0.access!.disable = true;
        layout.residual0.opacity = lerp(1.0, 0.1, t1_fadeEmbedAnim.t);

        residCol = splitGrid(layout, layout.residual0, Dim.X, exampleIdx + 0.5, t0_splitEmbedAnim.t * 4.0)!;
        residCol.highlight = 0.3;

        residCol.opacity = lerp(1.0, 0.0, t1_fadeEmbedAnim.t);

    }

    let tokValue = getBlockValueAtIdx(layout.idxObj, new Vec3(exampleIdx, 0, 0)) ?? 1;


    let tokColDupe: IBlkDef | null = null;
    let posColDupe: IBlkDef | null = null;

    if (t2_highlightTokenEmbed.t > 0.0) {
        let tokEmbedCol = splitGrid(layout, layout.tokEmbedObj, Dim.X, tokValue + 0.5, t2_highlightTokenEmbed.t * 4.0)!;

        tokColDupe = duplicateGrid(layout, tokEmbedCol);
        tokColDupe.t = 'i';
        tokEmbedCol.highlight = 0.3;

        let startPos = new Vec3(tokEmbedCol.x, tokEmbedCol.y, tokEmbedCol.z);
        let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(-2.0, 0, 3.0));

        let pos = startPos.lerp(targetPos, t3_moveTokenEmbed.t);

        tokColDupe.x = pos.x;
        tokColDupe.y = pos.y;
        tokColDupe.z = pos.z;
    }


    if (t4_highlightPosEmbed.t > 0.0) {
        let posEmbedCol = splitGrid(layout, layout.posEmbedObj, Dim.X, exampleIdx + 0.5, t4_highlightPosEmbed.t * 4.0)!;

        posColDupe = duplicateGrid(layout, posEmbedCol);
        posColDupe.t = 'i';
        posEmbedCol.highlight = 0.3;

        let startPos = new Vec3(posEmbedCol.x, posEmbedCol.y, posEmbedCol.z);
        let targetPos = new Vec3(residCol.x, residCol.y, residCol.z).add(new Vec3(2.0, 0, 3.0));

        let pos = startPos.lerp(targetPos, t5_movePosEmbed.t);

        posColDupe.x = pos.x;
        posColDupe.y = pos.y;
        posColDupe.z = pos.z;
    }

    if (t6_plusSymAnim.t > 0.0 && tokColDupe && posColDupe && t7_addAnim.t < 1.0) {
        for (let c = 0; c < layout.shape.C; c++) {
            let plusCenter = new Vec3(
                (tokColDupe.x + tokColDupe.dx + posColDupe.x) / 2,
                tokColDupe.y + layout.cell * (c + 0.5),
                tokColDupe.z + tokColDupe.dz / 2);

            let isActive = t6_plusSymAnim.t > (c + 1) / layout.shape.C;
            let opacity = lerp(0.0, 1.0, isActive ? 1 : 0);

            let fontOpts: IFontOpts = { color: new Vec4(0, 0, 0, 1).mul(opacity), size: 1.5, mtx: Mat4f.fromTranslation(plusCenter) };
            let w = measureText(render.modelFontBuf, '+', fontOpts);

            drawText(render.modelFontBuf, '+', -w/2, -fontOpts.size/2, fontOpts);
        }
    }

    let origResidPos = residCol ? new Vec3(residCol.x, residCol.y, residCol.z) : new Vec3();
    let offsetResidPos = origResidPos.add(new Vec3(0.0, 0, 3.0));

    if (t7_addAnim.t > 0.0 && tokColDupe && posColDupe) {
        let targetPos = offsetResidPos;
        let tokStartPos = new Vec3(tokColDupe.x, tokColDupe.y, tokColDupe.z);
        let posStartPos = new Vec3(posColDupe.x, posColDupe.y, posColDupe.z);

        let tokPos = tokStartPos.lerp(targetPos, t7_addAnim.t);
        let posPos = posStartPos.lerp(targetPos, t7_addAnim.t);

        tokColDupe.x = tokPos.x;
        tokColDupe.y = tokPos.y;
        tokColDupe.z = tokPos.z;
        posColDupe.x = posPos.x;
        posColDupe.y = posPos.y;
        posColDupe.z = posPos.z;

        if (t7_addAnim.t > 0.95) {
            tokColDupe.opacity = 0.0;
            posColDupe.opacity = 0.0;
            residCol.opacity = 1.0;
            residCol.highlight = 0.0;
            residCol.access!.disable = false;
            residCol.x = targetPos.x;
            residCol.y = targetPos.y;
            residCol.z = targetPos.z;
        }
    }

    if (t8_placeAnim.t > 0.0) {
        let startPos = offsetResidPos;
        let targetPos = origResidPos;
        let pos = startPos.lerp(targetPos, t8_placeAnim.t);
        residCol.x = pos.x;
        residCol.y = pos.y;
        residCol.z = pos.z;
    }

    if (t9_cleanupInstant.t > 0.0 && residCol) {
        residCol.opacity = 1.0;
        residCol.highlight = 0.0;
        residCol.access!.disable = false;
    }

    if (t11_fillRest.t > 0.0) {
        layout.residual0.access!.disable = true;

        let prevInfo = startProcessBefore(state, layout.residual0);
        processUpTo(state, t11_fillRest, layout.residual0, prevInfo);
    }
    // new Vec3(-6.9, 0, -36.5), new Vec3(281.5, 5.5, 0.8)
}
