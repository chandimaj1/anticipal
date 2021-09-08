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

/* newsletter/templates/blocks/text/settings.hbs */
class __TwigTemplate_3d2f5a063c527cb71c64b1128f7e61ed5bbf362006aba8f49ac40fb42665f510 extends \MailPoetVendor\Twig\Template
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
        echo "<h3>";
        echo $this->extensions['MailPoet\Twig\I18n']->translate("Text");
        echo "</h3>
";
        // line 2
        echo $this->extensions['MailPoet\Twig\I18n']->translate("Text");
        echo ": <textarea name=\"text\" class=\"text\" rows=\"5\" cols=\"40\">{{ model.text }}</textarea>
";
    }

    public function getTemplateName()
    {
        return "newsletter/templates/blocks/text/settings.hbs";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  42 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "newsletter/templates/blocks/text/settings.hbs", "/home/642110.cloudwaysapps.com/qvyqgnsxez/public_html/wp-content/plugins/mailpoet/views/newsletter/templates/blocks/text/settings.hbs");
    }
}
