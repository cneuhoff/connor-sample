;
(function () {
    "use strict"

    angular.module('client.main').controller('layoutController', LayoutController)

    LayoutController.$inject = ["$state", "$log", "usersService", "uiNotificationsService"]

    function LayoutController($state, $log, usersService, uiNotificationsService) {
        const vm = this

        vm.isCollapsed = false
        vm.minified = false
        vm.isToggled = false

        vm.active = _active
        vm.collapse = _collapse
        vm.checkCollapsed = _checkCollapsed
        vm.hideBar = _hideBar
        vm.slimToggle = _slimToggle
        vm.pageClick = _pageClick
        vm.logout = _logout
        vm.userData = {}

        vm.$onInit = $init

        function $init() {
            _currentUser()
            _currentUserSupporters()

            vm.entityArray = [{
                entity: 'main.users',
                name: 'Users'
            },
            {
                entity: 'main.clientProfiles',
                name: 'Client Profiles'
            },
            {
                entity: 'main.journalsEvents',
                name: 'Journal Events'
            },
            {
                entity: 'main.journalTags',
                name: 'Journal Tags'
            },
            {
                entity: 'main.traumaTypes',
                name: 'Trauma Types'
            },
            {
                entity: 'main.traumas',
                name: 'Traumas'
            },
            {
                entity: 'main.supportPosts',
                name: 'Support Posts'
            },
            {
                entity: 'main.treatmentInvitations',
                name: 'Treatment Invitations'
            },
            {
                entity: 'main.intakeForms',
                name: 'Intake Forms'
            },
            {
                entity: 'main.questionnaires',
                name: 'Questionnaires'
            },
            {
                entity: 'main.questionnaireResponses',
                name: 'Questionnaire Responses'
            },
            {
                entity: 'main.appointmentEvents',
                name: 'Appointment Events'
            },
            {
                entity: 'main.addresses',
                name: 'Addresses'
            }
            ]
        }

        function _active() {
            for (let i = 0; i < vm.entityArray.length; i++) {
                if ($state.includes(vm.entityArray[i].entity)) {
                    return true
                }
            }
        }

        function _collapse() {
            if (!vm.minified) {
                vm.isCollapsed = !vm.isCollapsed
            }
        }

        function _checkCollapsed() {
            if (vm.isCollapsed) {
                return "none"
            } else if (!vm.isCollapsed) {
                return "block"
            }
        }

        function _hideBar() {
            vm.minified = !vm.minified
            vm.isCollapsed = false
        }

        function _slimToggle() {
            vm.isToggled = !vm.isToggled
        }

        function _pageClick() {
            vm.isToggled = false
        }

        function _logout() {
            uiNotificationsService.confirm("Are you sure you want to logout?", "Yes, logout", "No, cancel")
                .then(data => {
                    if (!data) { return }
                    usersService.logout()
                        .then(response => {
                            uiNotificationsService.success("Logout successful.")
                            $state.go("secondary.homePage", { reload: true })
                        })
                        .catch(xhr => {
                            $log.log("Error", xhr)
                            uiNotificationsService.error("An error occurred while attempting to logout.")
                        })
                })
        }

        function _currentUser() {

            usersService.currentUser()
                .then(user => {
                    vm.userData = user.item
                    if (vm.userData.firstName && vm.userData.lastName) {
                        vm.userDisplayName = `${vm.userData.firstName} ${vm.userData.lastName}`
                    } else {
                        vm.userDisplayName = vm.userData.username
                    }
                })
                .catch(xhr => {
                    $log.log(xhr)
                })
        }

        function _currentUserSupporters() {

            usersService.readMyClients()
                .then(user => {
                    vm.supportees = user.items
                })
                .catch(xhr => {
                    $log.log(xhr)
                })
        }
    }

})();

(function () {
    angular.module('client.main').component('mainLayout', {
        templateUrl: 'client/main/main.layout.html',
        controller: 'layoutController',
    })
})();
