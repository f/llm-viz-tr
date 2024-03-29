import React from 'react';
import { LayerView } from '@/src/llm/LayerView';
import { InfoButton } from '@/src/llm/WelcomePopup';

export const metadata = {
  title: 'LLM Nasıl Çalışır?',
  description:  'Bir LLM\'nin 3D animasyonlu görselleştirmesi.',
};

import { Header } from '@/src/app/Header';

export default function Page() {
    return <>
        <Header title="LLM Nasıl Çalışır?">
            <InfoButton />
        </Header>
        <LayerView />
        <div id="portal-container"></div>
    </>;
}
