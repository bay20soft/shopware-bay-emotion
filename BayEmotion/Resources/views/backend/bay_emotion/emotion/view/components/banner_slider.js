//{namespace name=backend/emotion/view/components/banner_slider}
//{block name="backend/emotion/view/components/banner_slider"}
//{$smarty.block.parent}
Ext.define('Shopware.apps.BayCustomSlider.Emotion.view.components.BannerSlider', {
    override: 'Shopware.apps.Emotion.view.components.BannerSlider',
    createBannerFieldset: function () {
        var me = this;

        me.mediaSelection = Ext.create('Shopware.form.field.MediaSelection', {
            fieldLabel: me.snippets.select_banner,
            labelWidth: 155,
            albumId: -3,
            listeners: {
                scope: me,
                selectMedia: me.onAddBannerToGrid
            }
        });


        me.bannerStore = Ext.create('Ext.data.Store', {
            fields: [
                'position',
                'path',
                'link',
                'altText',
                'title',
                'mediaId',
                'bay_banner_html',
                'bay_bnr_txt_mrg_top',
                'bay_bnr_txt_mrg_right',
                'bay_bnr_txt_mrg_left'
            ]
        });

        me.ddGridPlugin = Ext.create('Ext.grid.plugin.DragDrop');

        me.cellEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            clicksToEdit: 2
        });

        me.bannerGrid = Ext.create('Ext.grid.Panel', {
            columns: me.createColumns(),
            autoScroll: true,
            store: me.bannerStore,
            height: 200,
            plugins: [me.cellEditing],
            viewConfig: {
                plugins: [me.ddGridPlugin],
                listeners: {
                    scope: me,
                    drop: me.onRepositionBanner
                }
            },
            listeners: {
                scope: me,
                edit: function () {
                    me.refreshHiddenValue();
                }
            }
        });

        return me.bannerFieldset = Ext.create('Ext.form.FieldSet', {
            title: me.snippets.banner_administration,
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [me.mediaSelection, me.bannerGrid]
        });
    },
    createColumns: function () {
        var me = this,
            snippets = me.snippets;

        columns = me.callOverridden(arguments);

        for (var index in columns) {

            if (typeof columns[index].xtype !== "undefined" && columns[index].xtype === "actioncolumn") {
                columns[index].items.push({
                    iconCls: 'sprite-image',
                    handler: function (view, rowIndex, colIndex, item) {
                        var store = view.getStore(),
                            record = store.getAt(rowIndex);

                        me.createBannerTextWindow(store, record);
                    }
                })
            }
        }

        return columns;
    },
    createBannerTextWindow: function (store, record) {
        var me = this,
            container = me.createTextWndContainer(store, record),
            toolbar = me.createTextWndToolbar(store, record);

        Ext.define('myCustomWindow', {
            extend: 'Enlight.app.Window',
            alias: 'widget.frame-image-main-window',
            title: 'Add Text',
            layout: 'border',
            width: '70%',
            height: '85%',
            stateful: true,
            stateId: 'frame-image-window',
            items: [container],
            bbar: [
                '->', toolbar
            ]
        });

        me.textWnd = Ext.create('myCustomWindow');
        me.textWnd.show();
    },
    createTextWndContainer: function (store, record) {
        var me = this,
            tinymce = {
                xtype: 'tinymce',
                name: 'Bay_banner_text',
                anchor: '100%',
                id: 'bannerText',
                fieldLabel: 'Text Element',
                labelWidth: 155,
                value: (record.data.bay_banner_html ? decodeURIComponent(escape(atob(record.data.bay_banner_html))) : '')
            };

        return Ext.create('Ext.container.Container', {
            region: 'center',
            padding: '20px',
            height: '400px',
            autoScroll: true,
            items: [
                Ext.create('Ext.form.FieldSet', {
                    title: 'Banner Text Config.',
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        tinymce,
                        Ext.create('Ext.panel.Panel', {
                            title: 'Text Margins Fields',
                            layout: {
                                type: 'table',
                                columns: 3
                            },
                            defaults: {
                                bodyStyle: 'padding:10px'
                            },
                            items: [{
                                xtype: 'numberfield',
                                fieldLabel: 'top',
                                id: 'bannerTextMarginTop',
                                padding: 15,
                                labelWidth: 60,
                                value: (record.data.bay_bnr_txt_mrg_top ? record.data.bay_bnr_txt_mrg_top : 0)
                            }, {
                                xtype: 'numberfield',
                                fieldLabel: 'right',
                                id: 'bannerTextMarginRight',
                                padding: 15,
                                labelWidth: 60,
                                value: (record.data.bay_bnr_txt_mrg_right ? record.data.bay_bnr_txt_mrg_right : 0)
                            }, {
                                xtype: 'numberfield',
                                fieldLabel: 'left',
                                id: 'bannerTextMarginLeft',
                                padding: 15,
                                labelWidth: 60,
                                value: (record.data.bay_bnr_txt_mrg_left ? record.data.bay_bnr_txt_mrg_left : 0)
                            }]
                        })
                    ]
                })
            ]
        });
    },
    createTextWndToolbar: function (store, record) {
        var me = this;

        return Ext.create('Ext.toolbar.Toolbar', {
            ui: 'shopware-ui',
            dock: 'bottom',
            height: '50px',
            items: [
                {
                    text: 'save',
                    cls: 'primary x-btn-right',
                    action: 'save-frame-images',
                    handler: function () {
                        var bannerText = Ext.getCmp('bannerText'),
                            bannerTextMarginTop = Ext.getCmp('bannerTextMarginTop'),
                            bannerTextMarginRight = Ext.getCmp('bannerTextMarginRight'),
                            bannerTextMarginLeft = Ext.getCmp('bannerTextMarginLeft');


                        var bannerHtml = btoa(unescape(encodeURIComponent(bannerText.rawValue))),
                            bannerTextMarginTopValue = bannerTextMarginTop.value,
                            bannerTextMarginRightValue = bannerTextMarginRight.value,
                            bannerTextMarginLeftValue = bannerTextMarginLeft.value;

                        record.raw.bay_banner_html = bannerHtml;
                        record.data.bay_banner_html = bannerHtml;


                        //margin banner Text
                        record.raw.bay_bnr_txt_mrg_top = bannerTextMarginTopValue;
                        record.data.bay_bnr_txt_mrg_top = bannerTextMarginTopValue;

                        record.raw.bay_bnr_txt_mrg_right = bannerTextMarginRightValue;
                        record.data.bay_bnr_txt_mrg_right = bannerTextMarginRightValue;

                        record.raw.bay_bnr_txt_mrg_left = bannerTextMarginLeftValue;
                        record.data.bay_bnr_txt_mrg_left = bannerTextMarginLeftValue;

                        me.textWnd.close();
                        Shopware.Notification.createGrowlMessage("Saved successfully");

                    }
                }
            ]
        });
    }
});

//{/block}