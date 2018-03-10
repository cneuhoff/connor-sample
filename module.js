/* global angular */
; (function () {
    'use strict'

    // add crud moduled as dependencies to the array below.
    angular.module('client.secondary.pages', [
        "client.secondary.pages.homePage",
        "ngCookies"

    ])

    // register client-side routes here, nested in "secondary" state.
    angular.module('client.secondary.pages').config(RouteConfig)

    RouteConfig.$inject = ['$stateProvider']

    function RouteConfig($stateProvider) {
        $stateProvider
            .state("secondary.registration", {
                url: "/anon/registration",
                views: {
                    "body@secondary": {
                        template: '<react-loader props="$resolve" react-component="RegistrationDetail" />'
                    }
                }
            })
            .state("secondary.loginPage", {
                url: "/anon/login",
                views: {
                    "body@secondary": {
                        template: '<react-loader props="$resolve" react-component="Login" />'
                    }
                }
            })
            .state("secondary.supporterSignUp", {
                url: "/anon/supporter-sign-up/:invitationId",
                views: {
                    "body@secondary": {
                        template: '<react-loader props="$resolve" react-component="SupporterSignup" />'
                    }
                },
                resolve: {
                    getUrlParams: getUrlParams
                }
            })
            .state('secondary.supporterConfirm', {
                url: '/anon/confirm-support/:invitationId',
                views: {
                    'body@secondary': {
                        component: 'supporterConfirmInvitation'
                    }
                },
                resolve: {
                    getUrlParams: getUrlParams
                }
            })
    }

    getUrlParams.$inject = ['$stateParams']

    function getUrlParams($stateParams){
        return {
            invitationId: $stateParams.invitationId
        }
    }

})();
