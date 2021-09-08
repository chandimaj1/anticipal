<?php

use MailPoetVendor\Twig\Environment;
use MailPoetVendor\Twig\Error\LoaderError;
use MailPoetVendor\Twig\Error\RuntimeError;
use MailPoetVendor\Twig\Extension\SandboxExtension;
use MailPoetVendor\Twig\Markup;
use MailPoetVendor\Twig\Sandbox\SecurityError;
use MailPoetVendor\Twig\Sandbox\SecurityNotAllowedTagError;
use MailPoetVendor\Twig\Sandbox\SecurityNotAllowedFilterError;
use MailPoetVendor\Twig\Sandbox\SecurityNotAllowedFunctionError;
use MailPoetVendor\Twig\Source;
use MailPoetVendor\Twig\Template;

/* newsletter/templates/blocks/posts/settingsSinglePost.hbs */
class __TwigTemplate_dba42e6ef5406197cb05b8c8ca9b107b537b36683e37af237565a0d240f9af5c extends \MailPoetVendor\Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<div class=\"mailpoet_settings_posts_single_post\">
    <label>
        <input id=\"mailpoet_select_post_{{ index }}\" class=\"mailpoet_select_post_checkbox\" type=\"checkbox\" class=\"checkbox\" value=\"\" name=\"post_selection\">
        {{#ellipsis model.post_title 40 '...'}}{{/ellipsis}}
    </label>
</div>
";
    }

    public function getTemplateName()
    {
        return "newsletter/templates/blocks/posts/settingsSinglePost.hbs";
    }

    public function getDebugInfo()
    {
        return array (  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "newsletter/templates/blocks/posts/settingsSinglePost.hbs", "/home/642110.cloudwaysapps.com/qvyqgnsxez/public_html/wp-content/plugins/mailpoet/views/newsletter/templates/blocks/posts/settingsSinglePost.hbs");
    }
}
