'use strict';
var __decorate =
	(this && this.__decorate) ||
	function(e, t, r, o) {
		var s,
			n = arguments.length,
			c = n < 3 ? t : null === o ? (o = Object.getOwnPropertyDescriptor(t, r)) : o;
		if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o);
		else
			for (var i = e.length - 1; i >= 0; i--)
				(s = e[i]) && (c = (n < 3 ? s(c) : n > 3 ? s(t, r, c) : s(t, r)) || c);
		return n > 3 && c && Object.defineProperty(t, r, c), c;
	};
Object.defineProperty(exports, '__esModule', { value: !0 });
var core_1 = require('@angular/core'),
	SidebarUserComponent = (function() {
		function e(e, t) {
			(this.authSvc = e), (this.usersSvc = t), (this.profileError = !1);
		}
		return (
			(e.prototype.ngOnInit = function() {
				this.loadUserProfile(), this.subscribeToUserUpdates();
			}),
			(e.prototype.ngOnDestroy = function() {
				this.userSub.unsubscribe();
			}),
			(e.prototype.loadUserProfile = function() {
				var e = this;
				this.authSvc
					.getUserProfile()
					.then(function(t) {
						(e.profile = t), (e.accountURL = e.authSvc.getAccountURL());
					})
					.catch(function() {
						e.profileError = !0;
					});
			}),
			(e.prototype.subscribeToUserUpdates = function() {
				var e = this;
				this.userSub = this.usersSvc.userSubject.subscribe(function(t) {
					e.loadUserProfile();
				});
            }),
            (e.avatarStyle = {
                fontWeight: 'bold',
                fontSize: '12px'
            }),
			(e = __decorate(
				[
					core_1.Component({
						selector: 'app-sidebar-user',
						templateUrl: './sidebar-user.component.html',
						styleUrls: [ './sidebar-user.component.scss' ]
					})
				],
				e
			))
		);
	})();
exports.SidebarUserComponent = SidebarUserComponent;
