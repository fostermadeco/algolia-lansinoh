import Hogan from 'hogan.js';
module.exports = function() {
    if (!!!templates) var templates = {};
    templates["autocomplete_categories_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a class=\"algoliasearch-autocomplete-hit\" href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("image_url",c,p,1),c,p,0,76,164,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("        <div class=\"thumb\">");t.b("\n" + i);t.b("            <img src=\"");t.b(t.v(t.f("image_url",c,p,0)));t.b("\" />");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("    <div class=\"info");if(!t.s(t.f("image_url",c,p,1),c,p,1,0,0,"")){t.b("-without-thumb");};t.b("\">");t.b("\n");t.b("\n" + i);if(t.s(t.d("_highlightResult.path",c,p,1),c,p,0,280,335,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("            ");t.b(t.t(t.d("_highlightResult.path.value",c,p,0)));t.b("\n" + i);});c.pop();}if(!t.s(t.d("_highlightResult.path",c,p,1),c,p,1,0,0,"")){t.b("            ");t.b(t.t(t.f("path",c,p,0)));t.b("\n" + i);};t.b("\n" + i);if(t.s(t.f("product_count",c,p,1),c,p,0,482,538,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("            <small>(");t.b(t.v(t.f("product_count",c,p,0)));t.b(")</small>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("</a>");return t.fl(); },partials: {}, subs: {  }});
    templates["autocomplete_extra_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a class=\"algoliasearch-autocomplete-hit\" href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\">");t.b("\n" + i);t.b("    <div class=\"info-without-thumb\">");t.b("\n" + i);t.b("        ");t.b(t.t(t.d("_highlightResult.value.value",c,p,0)));t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("</a>");return t.fl(); },partials: {}, subs: {  }});
    templates["autocomplete_pages_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a class=\"algoliasearch-autocomplete-hit\" href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\">");t.b("\n" + i);t.b("    <div class=\"info-without-thumb\">");t.b("\n" + i);t.b("        ");t.b(t.t(t.d("_highlightResult.name.value",c,p,0)));t.b("\n");t.b("\n" + i);if(t.s(t.f("content",c,p,1),c,p,0,158,250,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("            <div class=\"details\">");t.b("\n" + i);t.b("                ");t.b(t.t(t.f("content",c,p,0)));t.b("\n" + i);t.b("            </div>");t.b("\n" + i);});c.pop();}t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("</a>");return t.fl(); },partials: {}, subs: {  }});
    templates["autocomplete_products_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<!-- Product hit template -->");t.b("\n" + i);t.b("<a class=\"algoliasearch-autocomplete-hit\" href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("thumbnail_url",c,p,1),c,p,0,110,180,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("        <div class=\"thumb\"><img src=\"");t.b(t.v(t.f("thumbnail_url",c,p,0)));t.b("\" /></div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("    <div class=\"info\">");t.b("\n" + i);t.b("        ");t.b(t.t(t.d("_highlightResult.name.value",c,p,0)));t.b("\n");t.b("\n" + i);t.b("        <div class=\"algoliasearch-autocomplete-category\">");t.b("\n" + i);if(t.s(t.f("categories_without_path",c,p,1),c,p,0,364,445,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("                in                    ");t.b(t.t(t.f("categories_without_path",c,p,0)));t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.d("_highlightResult.color",c,p,1),c,p,0,514,808,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.d("_highlightResult.color.value",c,p,1),c,p,0,564,762,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("                    <span>");t.b("\n" + i);t.b("                       ");if(t.s(t.f("categories_without_path",c,p,1),c,p,0,643,646,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" | ");});c.pop();}t.b(" Color:  ");t.b(t.t(t.d("_highlightResult.color.value",c,p,0)));t.b("\n" + i);t.b("                    </span>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("        </div>");t.b("\n");t.b("\n" + i);t.b("        <div class=\"algoliasearch-autocomplete-price\">");t.b("\n" + i);t.b("            <span class=\"after_special ");if(t.s(t.d("price.USD.default_original_formated",c,p,1),c,p,0,986,995,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("promotion");});c.pop();}t.b("\">");t.b("\n" + i);t.b("                ");t.b(t.v(t.d("price.USD.default_formated",c,p,0)));t.b("\n" + i);t.b("            </span>");t.b("\n");t.b("\n" + i);if(t.s(t.d("price.USD.default_original_formated",c,p,1),c,p,0,1158,1301,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("                <span class=\"before_special\">");t.b("\n" + i);t.b("                    ");t.b(t.v(t.d("price.USD.default_original_formated",c,p,0)));t.b("\n" + i);t.b("                </span>");t.b("\n" + i);});c.pop();}t.b("        </div>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("</a>");return t.fl(); },partials: {}, subs: {  }});
    templates["autocomplete_suggestions_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<a class=\"algoliasearch-autocomplete-hit\" href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\">");t.b("\n" + i);t.b("    <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"algolia-glass-suggestion magnifying-glass\" width=\"24\" height=\"24\" viewBox=\"0 0 128 128\" >");t.b("\n" + i);t.b("        <g transform=\"scale(2.5)\">");t.b("\n" + i);t.b("            <path stroke-width=\"3\" d=\"M19.5 19.582l9.438 9.438\"></path>");t.b("\n" + i);t.b("            <circle stroke-width=\"3\" cx=\"12\" cy=\"12\" r=\"10.5\" fill=\"none\"></circle>");t.b("\n" + i);t.b("            <path d=\"M23.646 20.354l-3.293 3.293c-.195.195-.195.512 0 .707l7.293 7.293c.195.195.512.195.707 0l3.293-3.293c.195-.195.195-.512 0-.707l-7.293-7.293c-.195-.195-.512-.195-.707 0z\" ></path>");t.b("\n" + i);t.b("        </g>");t.b("\n" + i);t.b("    </svg>");t.b("\n" + i);t.b("    <div class=\"info-without-thumb\">");t.b("\n" + i);t.b("        ");t.b(t.t(t.d("_highlightResult.query.value",c,p,0)));t.b("\n");t.b("\n" + i);if(t.s(t.f("category",c,p,1),c,p,0,716,819,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("            <span class=\"text-muted\">in</span> <span class=\"category-tag\">");t.b(t.v(t.f("category",c,p,0)));t.b("</span>");t.b("\n" + i);});c.pop();}t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("</a>");return t.fl(); },partials: {}, subs: {  }});
    templates["instant_wrapper_template"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");if(t.s(t.f("findAutocomplete",c,p,1),c,p,0,21,74,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" <div id=\"algolia-search-instant-container\"></div>");t.b("\n" + i);});c.pop();}t.b(" <div id=\"algolia_instant_selector\" class=\"\">");t.b("\n");t.b("\n" + i);t.b("     ");t.b("\n" + i);t.b("     <div class=\"row\">");t.b("\n" + i);t.b("         <div class=\"col-md-3\" id=\"algolia-left-container\">");t.b("\n" + i);t.b("             <div id=\"refine-toggle\" class=\"visible-xs visible-sm\">+ Refine</div>");t.b("\n" + i);t.b("             <div class=\"hidden-xs hidden-sm\" id=\"instant-search-facets-container\">");t.b("\n" + i);t.b("                 <div id=\"current-refinements\"></div>");t.b("\n" + i);t.b("             </div>");t.b("\n" + i);t.b("         </div>");t.b("\n");t.b("\n" + i);t.b("         <div class=\"col-md-9\" id=\"algolia-right-container\">");t.b("\n" + i);t.b("             <div class=\"row\">");t.b("\n" + i);t.b("                 <div class=\"col-md-12\">");t.b("\n" + i);t.b("                     <div>");t.b("\n" + i);if(t.s(t.f("second_bar",c,p,1),c,p,0,689,1803,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("                         <div id=\"instant-search-bar-container\">");t.b("\n" + i);t.b("                             <div id=\"instant-search-box\">");t.b("\n" + i);t.b("                                 <div class=\"instant-search-bar-label\">");t.b("\n" + i);t.b("                                     <span class=\"icon\"></span>");t.b("\n" + i);t.b("                                     <span>Current search</span>");t.b("\n" + i);t.b("                                 </div>");t.b("\n" + i);t.b("                                 <div class=\"instant-search-bar-wrapper\">");t.b("\n" + i);t.b("                                     <label for=\"instant-search-bar\">");t.b("\n" + i);t.b("                                         Search:                                        </label>");t.b("\n");t.b("\n" + i);t.b("                                     <input placeholder=\"Search for products\"");t.b("\n" + i);t.b("                                            id=\"instant-search-bar\" type=\"text\" autocomplete=\"off\" spellcheck=\"false\"");t.b("\n" + i);t.b("                                            autocorrect=\"off\" autocapitalize=\"off\"/>");t.b("\n");t.b("\n" + i);t.b("                                     <span class=\"clear-cross clear-query-instant\"></span>");t.b("\n" + i);t.b("                                 </div>");t.b("\n" + i);t.b("                             </div>");t.b("\n" + i);t.b("                         </div>");t.b("\n" + i);});c.pop();}t.b("                     </div>");t.b("\n" + i);t.b("                 </div>");t.b("\n" + i);t.b("             </div>");t.b("\n" + i);t.b("             <ul class=\"tabs search-results-tabs\">");t.b("\n" + i);t.b("                <li>Products</li>");t.b("\n" + i);t.b("                <li>Pages</li>");t.b("\n" + i);t.b("             </ul>");t.b("\n" + i);t.b("             <div class=\"row\">");t.b("\n" + i);t.b("                 <div>");t.b("\n" + i);t.b("                     <div class=\"hits\">");t.b("\n" + i);t.b("                         <div class=\"infos\" style=\"display:none;\">");t.b("\n" + i);t.b("                             <div class=\"pull-right\">");t.b("\n" + i);t.b("                                 <div class=\"sort-by-label pull-left\">");t.b("\n" + i);t.b("                                     SORT BY                                    </div>");t.b("\n" + i);t.b("                                 <div class=\"pull-left\" id=\"algolia-sorts\"></div>");t.b("\n" + i);t.b("                             </div>");t.b("\n" + i);t.b("                             <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("                         </div>");t.b("\n" + i);t.b("                         <div class=\"row tabbed-content\">");t.b("\n" + i);t.b("                            <div class=\"col-md-12\">");t.b("\n" + i);t.b("                                <h5>Products</h5>");t.b("\n" + i);t.b("                                <div class=\"infos\">");t.b("\n" + i);t.b("                                    <div class=\"pull-left\" id=\"algolia-stats-products\"></div>");t.b("\n" + i);t.b("                                    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("                                </div>");t.b("\n" + i);t.b("                                <div id=\"instant-search-results-container-products\" class=\"instant-search-results-container clearfix\"></div>");t.b("\n" + i);t.b("                                <div class=\"text-center clearfix\">");t.b("\n" + i);t.b("                                    <div id=\"instant-search-pagination-container-products\"></div>");t.b("\n" + i);t.b("                                </div>");t.b("\n" + i);t.b("                            </div>");t.b("\n" + i);t.b("                        </div>");t.b("\n" + i);t.b("                        <div class=\"row tabbed-content\">");t.b("\n" + i);t.b("                            <div class=\"col-md-12\">");t.b("\n" + i);t.b("                                <h5>Pages</h5>");t.b("\n" + i);t.b("                                <div class=\"infos\">");t.b("\n" + i);t.b("                                    <div class=\"pull-left\" id=\"algolia-stats-pages\"></div>");t.b("\n" + i);t.b("                                    <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("                                </div>");t.b("\n" + i);t.b("                                <div id=\"instant-search-results-container-pages\" class=\"instant-search-results-container clearfix\"></div>");t.b("\n" + i);t.b("                                <div class=\"text-center clearfix\">");t.b("\n" + i);t.b("                                    <div id=\"instant-search-pagination-container-pages\"></div>");t.b("\n" + i);t.b("                                </div>");t.b("\n" + i);t.b("                            </div>");t.b("\n" + i);t.b("                        </div>");t.b("\n" + i);t.b("                     </div>");t.b("\n" + i);t.b("                 </div>");t.b("\n" + i);t.b("                 <div class=\"clearfix\"></div>");t.b("\n" + i);t.b("             </div>");t.b("\n");t.b("\n" + i);t.b("             ");t.b("\n" + i);t.b("         </div>");t.b("\n" + i);t.b("     </div>");t.b("\n");t.b("\n" + i);t.b(" </div>");return t.fl(); },partials: {}, subs: {  }});
    return templates;
}
