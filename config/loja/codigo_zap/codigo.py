import time
from loja.codigo_zap import core as core
import loja.codigo_zap.exception as exception
import loja.codigo_zap.log as log

def sendwhats_image(
    receiver: str,
    img_path: str,
    caption: str = "",
    wait_time: int = 15,
    tab_close: bool = False,
    close_time: int = 3,
) -> None:
    """Send Image to a WhatsApp Contact or Group at a Certain Time"""

    if (not receiver.isalnum()) and (not core.check_number(number=receiver)):
        raise exception.CountryCodeException("Country Code Missing in Phone Number!")

    current_time = time.localtime()
    core.send_image(
        path=img_path, caption=caption, receiver=receiver, wait_time=wait_time
    )
    log.log_image(_time=current_time, path=img_path, receiver=receiver, caption=caption)
    if tab_close:
        core.close_tab(wait_time=close_time)
