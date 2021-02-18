{extends file="parent:widgets/emotion/index.tpl"}

{* Config block for overriding configuration variables of the emotion element *}
{block name="widgets/emotion/index/element/config"}
    {$smarty.block.parent}

    {if $element.component.cssClass}
        {$itemCls = "{$itemCls} {$element.component.cssClass}"}
    {/if}
{/block}

{block name="widgets/emotion/index/emotion"}
    {block name="widgets_emotion_index_emotion_css_class"}
        <input class="emotion--wrapper--css-class"
               type="hidden"
               data-name="{$emotion.name}"
               value="{$emotion.attribute.css_class}"/>
    {/block}
    {$smarty.block.parent}
{/block}