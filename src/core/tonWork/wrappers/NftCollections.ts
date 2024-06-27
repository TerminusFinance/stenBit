import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';
import { encodeOffChainContent } from './helpers/content';

export type NftCollectionsConfig = {
    owner_address: Address;
    next_item_index: number;
    content: Cell;
    nft_item_code: Cell;
    royalty_params: RoyaltyParams;
};

export type RoyaltyParams = {
    royalty_factor: number;
    royalty_base: number;
    royalty_address: Address;
};

export type NftCollectionContent = {
    collectionContent: string;
    commonContent: string;
};


export function buildNftCollectionContentCell(data: NftCollectionContent): Cell {
    const contentCell = beginCell();

    const collectionContent = encodeOffChainContent(data.collectionContent);

    const commonContent = beginCell();
    commonContent.storeStringTail(data.commonContent);

    contentCell.storeRef(collectionContent);
    contentCell.storeRef(commonContent);

    return contentCell.endCell();
}

export function nftCollectionConfigToCell(config: NftCollectionsConfig): Cell {
    return beginCell()
        .storeAddress(config.owner_address)
        .storeUint(config.next_item_index, 64)
        .storeRef(config.content)
        .storeRef(config.nft_item_code)
        .storeRef(
            beginCell()
                .storeUint(config.royalty_params.royalty_factor, 16)
                .storeUint(config.royalty_params.royalty_base, 16)
                .storeAddress(config.royalty_params.royalty_address)
        )
        .endCell();
}

export function nftCollectionsConfigToCell(config: NftCollectionsConfig): Cell {
    return nftCollectionConfigToCell(config);
}

export class NftCollections implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    }

    static createFromAddress(address: Address) {
        return new NftCollections(address);
    }

    static createFromConfig(config: NftCollectionsConfig, code: Cell, workchain = 0) {
        const data = nftCollectionsConfigToCell(config);
        const init = { code, data };
        return new NftCollections(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }


    async sendToDeployNewNft(provider: ContractProvider, via: Sender, value: bigint,
                             opts: {
                                 itemIndex: number;
                                 itemOwnerAddress: Address;
                                 itemContent: string;
                                 amount: bigint;
                             }) {

        const nftContent = beginCell();
        // nftContent.storeBuffer(Buffer.from(opts.itemContent));
        nftContent.storeStringTail(opts.itemContent);

        const nftMessage = beginCell();

        nftMessage.storeAddress(opts.itemOwnerAddress);
        nftMessage.storeRef(nftContent);

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(1, 32).storeUint(0, 64).storeUint(opts.itemIndex, 64).storeCoins(opts.amount)
                .storeRef(nftMessage).endCell()
        });
    }

    async get_collection_data(provider: ContractProvider) {
        const res = await provider.get('get_collection_data', []);
        return res.stack;
    }

    async get_nft_address_by_index(provider: ContractProvider, index: bigint) {
        const res = await provider.get('get_nft_address_by_index', [{
            type: 'int', value: index
        }]);
        return res.stack.readAddressOpt();
    }

    async get_royalty_params(provider: ContractProvider) {
        const res = await provider.get('royalty_params', []);
        return res.stack.skip(1).readNumber();
    }


}