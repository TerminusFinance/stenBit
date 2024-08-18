import React, { useState } from 'react';
import './PriceSelector.css';

interface Price {
    name: string;
    price: number;
}

interface PriceSelectorProps {
    tabs: Price[];
    onTabSelect: (selectedTab: Price) => void;
    icoCoin?: string | null
}

const PriceSelector: React.FC<PriceSelectorProps> = ({ tabs, onTabSelect, icoCoin }) => {
    const [selectedTab, setSelectedTab] = useState<Price>(tabs[0]);

    const handleTabClick = (tab: Price) => {
        setSelectedTab(tab);
        onTabSelect(tab);
    };

    return (
        <div className="price-selector">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    className={`price-tab ${tab.name === selectedTab.name ? 'active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                >
                    <span className="price-value">{tab.name}</span>
                    <div style={{display: 'flex', alignItems: 'center', alignContent:"center", flexDirection: 'row'}}>
                        {icoCoin ? (
                            <img src={icoCoin} style={{width:'18px', height:'18px', marginRight :'4px'}} />
                        ):(
                            <span className="price-value">$</span>
                        )}
                        <span className="price-value">{tab.price}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default PriceSelector;
