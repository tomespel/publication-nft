/// Module: publication_nft
/// A module for creating and managing NFTs for published works on the SUI blockchain
module publication_nft::publication_nft {
    use std::string::{String};
    use sui::event;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::display;
    use sui::package;

    /// The PublicationNFT type represents an NFT for a published work
    public struct PublicationNFT has key, store {
        id: UID,
        /// Title of the publication
        title: String,
        /// Author of the publication
        author: String,
        /// Publication date (unix timestamp in milliseconds)
        publication_date: u64,
        /// ISBN of the publication
        isbn: String,
        /// URL for the publication metadata (e.g., IPFS)
        url: Url,
        /// Image URL for the publication cover
        image_url: Url,
    }

    /// One-Time-Witness for the module
    public struct PUBLICATION_NFT has drop {}

    /// Event emitted when a new publication NFT is minted
    public struct PublicationMinted has copy, drop {
        object_id: address,
        creator: address,
        title: String,
        author: String,
    }

    /// Module initializer
    fun init(otw: PUBLICATION_NFT, ctx: &mut TxContext) {
        let keys = vector[
            b"title".to_string(),
            b"author".to_string(),
            b"publication_date".to_string(),
            b"isbn".to_string(),
            b"url".to_string(),
            b"image_url".to_string(),
            b"description".to_string(),
            b"project_url".to_string(),
            b"creator".to_string(),
        ];

        let values = vector[
            b"{title}".to_string(),
            b"{author}".to_string(),
            b"{publication_date}".to_string(),
            b"{isbn}".to_string(),
            b"{url}".to_string(),
            b"{image_url}".to_string(),
            b"NFT for published work: {title} by {author}".to_string(),
            b"https://github.com/tomespel/publication-nft".to_string(),
            b"Publication NFT".to_string(),
        ];

        let publisher = package::claim(otw, ctx);

        let mut display = display::new_with_fields<PublicationNFT>(
            &publisher, keys, values, ctx
        );

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Mint a new publication NFT
    public entry fun mint(
        title: String,
        author: String,
        publication_date: u64,
        isbn: String,
        url: vector<u8>,
        image_url: vector<u8>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let nft = PublicationNFT {
            id: object::new(ctx),
            title,
            author,
            publication_date,
            isbn,
            url: url::new_unsafe_from_bytes(url),
            image_url: url::new_unsafe_from_bytes(image_url),
        };

        event::emit(PublicationMinted {
            object_id: object::uid_to_address(&nft.id),
            creator: tx_context::sender(ctx),
            title: nft.title,
            author: nft.author,
        });

        transfer::public_transfer(nft, recipient);
    }

    /// Transfer a publication NFT to a new owner
    public entry fun transfer_nft(
        nft: PublicationNFT,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient);
    }

    /// Burn a publication NFT
    public entry fun burn(nft: PublicationNFT, _ctx: &mut TxContext) {
        let PublicationNFT {
            id,
            title: _,
            author: _,
            publication_date: _,
            isbn: _,
            url: _,
            image_url: _,
        } = nft;
        object::delete(id);
    }

    /// Get the title of a publication NFT
    public fun title(nft: &PublicationNFT): String {
        nft.title
    }

    /// Get the author of a publication NFT
    public fun author(nft: &PublicationNFT): String {
        nft.author
    }

    /// Get the publication date of a publication NFT
    public fun publication_date(nft: &PublicationNFT): u64 {
        nft.publication_date
    }

    /// Get the ISBN of a publication NFT
    public fun isbn(nft: &PublicationNFT): String {
        nft.isbn
    }

    /// Get the URL of a publication NFT
    public fun url(nft: &PublicationNFT): &Url {
        &nft.url
    }

    /// Get the image URL of a publication NFT
    public fun image_url(nft: &PublicationNFT): &Url {
        &nft.image_url
    }
}
