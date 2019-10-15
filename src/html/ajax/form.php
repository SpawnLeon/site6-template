<?php
header('Access-Control-Allow-Origin:*');

$formID =  $_REQUEST['formID'];
$response = new stdClass;
ob_start();
?>
<form action="" class="form">
    <div class="form__header">
        <div class="form__title">Здесь заголовок формы</div>
        <div class="form__description">
            Здесь какое-то описание формы
        </div>
    </div>
    <div class="form__content">
       <div class="form__item form-item">
           <label class="form-item__label">
               <input type="text" placeholder="Имя" class="form-item__field form-item__field--text" value="">
           </label>
       </div>
        <div class="form__item form-item">
            <label class="form-item__label">
                <textarea placeholder="Введите ваше сообщение" class="form-item__field form-item__field--textarea"></textarea>
            </label>
        </div>
    </div>
    <div class="form__footer">
        <div class="form__actions">
            <div class="form__required-note">
                <span class="form__asterisk">*</span> Поля обязательные для заполнения
            </div>
            <button type="button" class="btn--clear "></button>
        </div>
        <div class="form__bottom">
            <div class="form__personal-data">
                <label class="custom-checkbox">
                    <input type="checkbox" class="custom-checkbox__field">
                    <span class="custom-checkbox__label"> <span>Нажимая кнопку Купить, я даю <a href="">согласие на обработку персональных данных</a></span></span>
                </label>
            </div>

        </div>

    </div>
</form>
<?php
$response->form = ob_get_contents();
ob_end_clean();
echo json_encode($response);