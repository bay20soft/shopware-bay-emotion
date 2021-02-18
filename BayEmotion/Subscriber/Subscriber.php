<?php

namespace BayEmotion\Subscriber;

use Enlight\Event\SubscriberInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Enlight_Controller_ActionEventArgs;


class Subscriber implements SubscriberInterface
{
    /**
     * @var string
     */
    private $viewDir;

    /**
     * @var ContainerInterface
     */
    private $container;

    public static function getSubscribedEvents()
    {
        return [
            'Theme_Inheritance_Template_Directories_Collected' => ['onTemplateDirectoriesCollect', 0],
            'Enlight_Controller_Action_PostDispatch_Backend_Emotion' => ['onPostDispatchBackendEmotion'],
            'Enlight_Controller_Action_PostDispatch_Widgets' => ['onPostDispatchWidgets'],
        ];
    }

    /**
     * @param String $viewDir
     * @param ContainerInterface $container
     */
    public function __construct(
        ContainerInterface $container,
        $viewDir
    )
    {
        $this->viewDir = $viewDir;
        $this->container = $container;
    }

    /**
     * @param Enlight_Controller_ActionEventArgs $args
     */
    public function onPostDispatchBackendEmotion(\Enlight_Controller_ActionEventArgs $args)
    {
        $controller = $args->getSubject();
        $view = $controller->View();
        $request = $controller->Request();

        $view->addTemplateDir($this->viewDir);

        if ($request->getActionName() === 'load') {
            $view->extendsTemplate('backend/bay_emotion/emotion/view/components/banner_slider.js');
            $view->extendsTemplate('backend/bay_emotion/emotion/model/banner_slider.js');
        }
    }

    /**
     * @param Enlight_Controller_ActionEventArgs $args
     */
    public function onPostDispatchWidgets(Enlight_Controller_ActionEventArgs $args)
    {
        $controller = $args->getSubject();
        $view = $controller->View();
        $view->addTemplateDir($this->viewDir);
    }

    /**
     * @param \Enlight_Event_EventArgs $args
     */
    public function onTemplateDirectoriesCollect(\Enlight_Event_EventArgs $args)
    {
        $dirs = $args->getReturn();

        $dirs['bay_emotion'] = $this->viewDir;

        $args->setReturn($dirs);
    }

    protected function registerMyTemplateDir()
    {
        $this->container->get('template')->addTemplateDir(
            $this->viewDir, 'bay_emotion'
        );
    }
}
