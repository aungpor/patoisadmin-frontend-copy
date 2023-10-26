import { useState } from "react";
import ConfigContentCarouselBannerTable from "../../components/table/ConfigContentCarouselBannerTable";
import ConfigSugessionContent from "../../components/table/ConfigSugessionContent";
import ConfigAdsBanner from "../../components/table/ConfigAdsBanner"

function ConfigContents() {

    return (
        <>
            <ConfigContentCarouselBannerTable />
            <ConfigSugessionContent />
            <ConfigAdsBanner />
        </>
    );
}

export default ConfigContents;
