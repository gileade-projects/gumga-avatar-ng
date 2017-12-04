declare function require(name: string);
import './component.scss';

import ModalCropController from './crop/modal.controller';

let Component = {
    bindings: {
        height: '@?',
        width: '@?',
        ngModel: '=',
        pickerText: '@?',
        cropTitle: '@?',
        type: '@?', // square|circle
        useGumgaImage: '=?'
    },
    template: require('./component.html'),
    controller: ['$timeout', '$attrs', '$element', '$uibModal', function ($timeout, $attrs, $element, $uibModal) {
        let ctrl = this;

        ctrl.$onInit = () => {
            ctrl.width = ctrl.width || 170;
            ctrl.height = ctrl.height || 170;
            ctrl.useGumgaImage = ctrl.useGumgaImage || false;
            ctrl.type = ctrl.type || 'square';
            ctrl.input = $element.find('input[type="file"]');
            ctrl.input.change((evt) => ctrl.changeImage(evt));
            if(ctrl.ngModel && ctrl.useGumgaImage){
                ctrl.image = 'data:' + ctrl.ngModel.mimeType + ';base64,' + ctrl.ngModel.bytes;
            }
            if(ctrl.ngModel && !ctrl.useGumgaImage){
                ctrl.image = ctrl.ngModel;
            }
        }

        ctrl.changeImage = (evt) => {
            if (ctrl.input[0].files && ctrl.input[0].files[0]) {
                let file = ctrl.input[0].files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (evt: any) {
                    ctrl.input[0].value = '';
                    ctrl.openModalCropImage(evt.target.result);
                };
            }
        }

        ctrl.setPicture = (image) => {
            //TRANSFORMA PRA OBJETO
            if(image && ctrl.useGumgaImage){
                ctrl.image = image;
                let mimeType = image.substring((image.indexOf(':') + 1), image.indexOf(';'));
                let picture = {
                    mimeType: mimeType,
                    name: 'picture.' + (mimeType.substring((mimeType.lastIndexOf('/')+1), mimeType.length)),
                    bytes: image.substring((image.indexOf(',') + 1), image.length),
                    size: Math.round((image.length * 6) / 8)
                };
                ctrl.ngModel = picture;
            }
            //COM URL
            if(image && !ctrl.useGumgaImage){
                ctrl.image   = image;
                ctrl.ngModel = image;
            }
        }

        ctrl.openModalCropImage = image => {
            let modalInstance = $uibModal.open({
                template: require('./crop/modal.crop.html'),
                controller: ModalCropController,
                controllerAs: '$ctrl',
                backdrop: 'static',
                openedClass: 'gumga-avatar',
                size: 'md',
                resolve: {
                    image: () => image,
                    cropTitle: () => ctrl.cropTitle,
                    width: () => ctrl.width,
                    height: () => ctrl.height,
                    type: () => ctrl.type
                }
            });
            modalInstance.result.then(function (imageCropped) {
                if (imageCropped) {
                    ctrl.setPicture(imageCropped);
                }
            });
        }

    }]
}

export default Component;