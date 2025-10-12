/// Module: publication_nft
/// A module for creating and managing NFTs for published works on the SUI blockchain
/// Module: publication_nft
/// A module for creating and managing NFTs for published works on the SUI blockchain
module publication_nft::publication_nft;

use std::string::String;
use sui::display;
use sui::event;
use sui::object;
use sui::package;
use sui::tx_context;
use sui::url;

/// The PublicationNFT type represents an NFT for a published work
public struct PublicationNFT has key, store {
    id: UID,
    /// Title of the publication
    title: String,
    /// Authors of the publication
    authors: String,
    /// Publication date (unix timestamp in milliseconds)
    publication_date: u64,
    /// DOI of the publication
    doi: String,
    /// URL for the publication metadata (e.g., IPFS)
    url: url::Url,
    /// Image URL for the publication cover
    image_url: url::Url,
    /// Description/abstract of the publication
    description: String,
    /// License of the publication
    license: String,
    /// Field of study
    field: String,
    /// Version of the publication
    version: String,
    /// External URL to the publication
    external_url: url::Url,
}

/// One-Time-Witness for the module
public struct PUBLICATION_NFT has drop {}

/// Event emitted when a new publication NFT is minted
public struct PublicationMinted has copy, drop {
    object_id: address,
    creator: address,
    title: String,
    authors: String,
}

/// Module initializer
fun init(otw: PUBLICATION_NFT, ctx: &mut tx_context::TxContext) {
    let keys = vector[
        b"name".to_string(),
        b"description".to_string(),
        b"image_url".to_string(),
        b"link".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
        b"title".to_string(),
        b"authors".to_string(),
        b"publication_date".to_string(),
        b"doi".to_string(),
        b"url".to_string(),
        b"license".to_string(),
        b"field".to_string(),
        b"version".to_string(),
        b"external_url".to_string(),
    ];

    let values = vector[
        b"{title}".to_string(), // Placeholder for dynamic name
        b"{description}".to_string(),
        b"{image_url}".to_string(),
        b"{external_url}".to_string(),
        b"https://github.com/tomespel/publication-nft".to_string(),
        b"Publication NFT".to_string(),
        b"{title}".to_string(),
        b"{authors}".to_string(),
        b"{publication_date}".to_string(),
        b"{doi}".to_string(),
        b"{url}".to_string(),
        b"{license}".to_string(),
        b"{field}".to_string(),
        b"{version}".to_string(),
        b"{external_url}".to_string(),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<PublicationNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

/// Mint a new publication NFT
public fun mint(
    title: String,
    authors: String,
    publication_date: u64,
    doi: String,
    url: vector<u8>,
    image_url: vector<u8>,
    description: String,
    license: String,
    field: String,
    version: String,
    external_url: vector<u8>,
    recipient: address,
    ctx: &mut tx_context::TxContext,
) {
    let nft = PublicationNFT {
        id: object::new(ctx),
        title,
        authors,
        publication_date,
        doi,
        url: url::new_unsafe_from_bytes(url),
        image_url: url::new_unsafe_from_bytes(image_url),
        description,
        license,
        field,
        version,
        external_url: url::new_unsafe_from_bytes(external_url),
    };

    event::emit(PublicationMinted {
        object_id: object::uid_to_address(&nft.id),
        creator: tx_context::sender(ctx),
        title,
        authors,
    });

    transfer::public_transfer(nft, recipient);
}

/// Transfer a publication NFT to a new owner
public fun transfer_nft(nft: PublicationNFT, recipient: address, _ctx: &mut TxContext) {
    transfer::public_transfer(nft, recipient);
}

/// Burn a publication NFT
public fun burn(nft: PublicationNFT, _ctx: &mut TxContext) {
    let PublicationNFT {
        id,
        title: _,
        authors: _,
        publication_date: _,
        doi: _,
        url: _,
        image_url: _,
        description: _,
        license: _,
        field: _,
        version: _,
        external_url: _,
    } = nft;
    object::delete(id);
}

/// Get the title of a publication NFT
public fun title(nft: &PublicationNFT): String {
    nft.title
}

/// Get the authors of a publication NFT
public fun authors(nft: &PublicationNFT): String {
    nft.authors
}

/// Get the publication date of a publication NFT
public fun publication_date(nft: &PublicationNFT): u64 {
    nft.publication_date
}

/// Get the DOI of a publication NFT
public fun doi(nft: &PublicationNFT): String {
    nft.doi
}

/// Get the URL of a publication NFT
public fun url(nft: &PublicationNFT): &url::Url {
    &nft.url
}

/// Get the image URL of a publication NFT
public fun image_url(nft: &PublicationNFT): &url::Url {
    &nft.image_url
}

/// Get the description of a publication NFT
public fun description(nft: &PublicationNFT): String {
    nft.description
}

/// Get the license of a publication NFT
public fun license(nft: &PublicationNFT): String {
    nft.license
}

/// Get the field of a publication NFT
public fun field(nft: &PublicationNFT): String {
    nft.field
}

/// Get the version of a publication NFT
public fun version(nft: &PublicationNFT): String {
    nft.version
}

/// Get the external URL of a publication NFT
public fun external_url(nft: &PublicationNFT): &url::Url {
    &nft.external_url
}
