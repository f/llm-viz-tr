import React from 'react';
import { Phase } from "./Walkthrough";
import { commentary, embed, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import s from './Walkthrough.module.scss';
import { Vec3 } from '@/src/utils/vector';

let minGptLink = 'https://github.com/karpathy/minGPT';
let pytorchLink = 'https://pytorch.org/';
let andrejLink = 'https://karpathy.ai/';
let zeroToHeroLink = 'https://karpathy.ai/zero-to-hero.html';

export function walkthrough01_Prelim(args: IWalkthroughArgs) {
    let { state, walkthrough: wt } = args;

    if (wt.phase !== Phase.Intro_Prelim) {
        return;
    }

    setInitialCamera(state, new Vec3(184.744, 0.000, -636.820), new Vec3(296.000, 16.000, 13.500));

    let c0 = commentary(wt, null, 0)`
Algoritmanın karmaşıklıklarına dalmadan önce, kısa bir adım geri atalım.

Bu rehber, eğitime değil, çıkarıma odaklanır ve bu süreç tüm makine öğrenimi sürecinin yalnızca küçük bir parçasıdır.
Bizim durumumuzda, modelin ağırlıkları önceden eğitilmiştir ve çıktı üretmek için çıkarım sürecini kullanıyoruz. Bu işlem de direkt olarak tarayıcınızda çalışır.

Burada sergilenen model, "bağlam tabanlı token tahmincisi" olarak tanımlanabilecek GPT (jeneratif önceden eğitilmiş dönüştürücü) ailesinin bir parçasıdır.
OpenAI, bu aileyi 2018'de tanıttı ve GPT-2, GPT-3 ve GPT-3.5 Turbo gibi dikkate değer üyeleri içermektedir. Bunlardan sonuncusu yaygın olarak kullanılan ChatGPT'nin temelidir.
Ayrıca GPT-4 ile ilgili de olabilir, ancak bu henüz tam olarak bilinmiyor.

Bu rehber, ${embedLink('Andrej Karpathy', andrejLink)} tarafından ${embedLink('PyTorch', pytorchLink)}'ta oluşturulan minimal bir GPT uygulaması olan ${embedLink('minGPT', minGptLink)} GitHub projesinden esinlenmiştir.
Onun YouTube serisi ${embedLink("Neural Networks: Zero to Hero", zeroToHeroLink)} ve minGPT projesi, bu rehberin oluşturulmasında paha biçilmez kaynaklar olmuştur.
Burada öne çıkan oyuncak model, minGPT projesi içinde bulunan bir modele dayanmaktadır.

O halde, hemen başlayalım!`;

}

export function embedLink(a: React.ReactNode, href: string) {
    return embedInline(<a className={s.externalLink} href={href} target="_blank" rel="noopener noreferrer">{a}</a>);
}

export function embedInline(a: React.ReactNode) {
    return { insertInline: a };
}


// Another similar model is BERT (bidirectional encoder representations from transformers), a "context-aware text encoder" commonly
// used for tasks like document classification and search.  Newer models like Facebook's LLaMA (large language model architecture), continue to use
// a similar transformer architecture, albeit with some minor differences.
