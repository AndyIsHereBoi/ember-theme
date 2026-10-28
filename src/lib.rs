use shared::{State, extensions::Extension};

#[derive(Default)]
pub struct ExtensionStruct;
// ^ must be called ExtensionStruct and implement Default, it can be a regular struct with attached data if desired.

#[async_trait::async_trait]
impl Extension for ExtensionStruct {
    async fn initialize(&mut self, _state: State) {
        tracing::info!(
            "HELLO FROM MY EXTENSION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        );
    }

    // you can find more trait methods here: https://cratedocs.calagopus.com/shared/extensions/trait.Extension
    // due to how async_trait works, you wont be able to use editor suggestions effectively.
}
