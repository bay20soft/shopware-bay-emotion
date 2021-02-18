{extends file='parent:widgets/emotion/components/component_banner_slider.tpl'}

{block name="frontend_widgets_banner_slider_banner" append}
    <div class="bay-custom-slider-form-text-content">
        {foreach $Data['banner_slider'] as $item}
            {if $banner['id'] == $item['mediaId']}
                {$itemConfig = $item}
            {/if}
        {/foreach}
        {if $itemConfig['bay_banner_html']}
            <div class="bayCatTextDiv" style="
            {if $itemConfig['bay_bnr_txt_mrg_left']}
                    margin-left: {$itemConfig['bay_bnr_txt_mrg_left']}%;
            {/if}
            {if $itemConfig['bay_bnr_txt_mrg_right']}
                    margin-right: {$itemConfig['bay_bnr_txt_mrg_right']}%;
            {/if}
            {if $itemConfig['bay_bnr_txt_mrg_top']}
                    margin-top: {$itemConfig['bay_bnr_txt_mrg_top']}%;
            {/if}
                    ">
                {base64_decode($itemConfig['bay_banner_html']|unescape:"htmlall")}
            </div>
        {/if}
    </div>
{/block}