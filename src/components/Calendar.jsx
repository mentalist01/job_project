import React from "react";
import Modal from "react-modal";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { observer } from "mobx-react";
import formStore from "../FormStore";

import { ReactComponent as ArrowLeft } from '../svg/arrow-left.svg';
import { ReactComponent as ArrowRight } from '../svg/arrow-right.svg';


const Calendar = observer(() => {
  Modal.setAppElement('#root');
  const handleDateChange = (date) => {
    formStore.setSelectedDate(date);
    updateModalHeight();
  };

  const handleSave = () => {
    formStore.setSelectedDate(formStore.selectedDateForSave);
    formStore.setShowModal(false);
  };

  const handleClose = () => {
    formStore.setShowModal(false);
  };
  const updateModalHeight = () => {
    const daysCount = generateCalendarDays().days.length;
    const calculatedHeight = daysCount > 40 ? "330px" : "300px"; // Здесь можно задать любую высоту по вашему усмотрению
    formStore.setModalHeight(calculatedHeight);
  };
  
  const generateCalendarDays = () => {
    const currentMonth = formStore.selectedDate.clone().month();

    const firstDayOfMonth = formStore.selectedDate.clone().startOf("month"); // Получение первого дня текущего месяца
    const daysInMonth = formStore.selectedDate.daysInMonth(); // Получение количества дней в текущем месяце
    const firstDayOfWeek = firstDayOfMonth.day(); // Получение дня недели для первого дня месяца
    const lastDayOfMonth = formStore.selectedDate.clone().endOf("month");
    const lastDayOfWeek = lastDayOfMonth.day();
    const days = []; // Создание пустого массива для хранения дней месяца

    // Перемещение к началу предыдущего месяца
    const previousMonth = firstDayOfMonth.clone().subtract(1, "month");

    // Добавление дней предшествующего месяца в массив
    if (firstDayOfWeek === 0) {
      for (let i = 6; i > 0; i--) {
        const day = previousMonth
          .clone()
          .endOf("month")
          .subtract(i - 1, "days");
        days.push(day);
      }
    } else {
      for (let i = firstDayOfWeek - 1; i > 0; i--) {
        const day = previousMonth
          .clone()
          .endOf("month")
          .subtract(i - 1, "days");
        days.push(day);
      }
    }

    // Добавление объектов Moment, представляющих дни текущего месяца, в массив
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(firstDayOfMonth.clone().date(i));
    }

    const nextMonth = formStore.selectedDate.clone().add(1, "month");

    for (let i = lastDayOfWeek; i < 7; i++) {
      const day = nextMonth
        .clone()
        .startOf("month")
        .date(i - lastDayOfWeek + 1);
      days.push(day);
    }
    const daysAndCurrentMonth = {days,currentMonth};
    return daysAndCurrentMonth; // Возврат массива дней месяца
  };
  updateModalHeight();
  return (
    <div className="calendar">
      <TextField
        variant="outlined"
        value={formStore.selectedDate.format("DD.MM.YYYY")}
        onClick={() => formStore.setShowModal(true)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => formStore.setShowModal(true)}>
              <CalendarMonthIcon />
            </IconButton>
          ),
        }}
        size="small"
        readOnly
      />

      <Modal
        isOpen={formStore.showModal}
        onRequestClose={handleClose}
        contentLabel="Выберите дату"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            overflow: "hidden",
            padding: "0",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "230px",
            height: formStore.modalHeight,
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: "1500",
          },
        }}
      >
        <div className="modal-inside">
          <div className="dates-navigation">
            <IconButton
              onClick={() =>
                handleDateChange(
                  formStore.selectedDate.clone().subtract(1, "month")
                )
              }
            >
              <ArrowLeft style={{width:"30px", height:"30px"}} />
            </IconButton>
            <Typography variant="body1" gutterBottom>
              {formStore.selectedDate.format("MMMM YYYY")}
            </Typography>
            <IconButton
              onClick={() =>
                handleDateChange(formStore.selectedDate.clone().add(1, "month"))
              }
            >
              <ArrowRight style={{width:"30px", height:"30px"}} />
            </IconButton>
          </div>
          <div className="days-of-week">
            <Typography variant="body2" className="day-of-week">Пн</Typography>
            <Typography variant="body2" className="day-of-week">Вт</Typography>
            <Typography variant="body2" className="day-of-week">Ср</Typography>
            <Typography variant="body2" className="day-of-week">Чт</Typography>
            <Typography variant="body2" className="day-of-week">Пт</Typography>
            <Typography variant="body2" className="day-of-week">Сб</Typography>
            <Typography variant="body2" className="day-of-week">Вс</Typography>
          </div>
          <div className="day-buttons_wrapper">
            
            {
            generateCalendarDays().days.map((day, index) => (
              <div key={index}>
                {(
                  <button
                    onClick={() => formStore.setSelectedDateForSave(day)}
                    style={{
                      backgroundColor: day.isSame(
                        formStore.selectedDateForSave,
                        "day"
                      )
                        ? "#2b92ff"
                        : "inherit",
                      color: day.isSame(formStore.selectedDateForSave, "day")
                        ? "white"
                        : (day.month()==generateCalendarDays().currentMonth)?"inherit":"gray",
                    }}
                    className="day-button"
                  >
                    {day.format("D")}
                  </button>
                ) }
              </div>
            ))}
          </div>

          <ButtonGroup className="save-cancel-buttons">
            <Button
              onClick={handleSave}
              className="save-button"
              variant="contained"
            >
              Сохранить
            </Button>
            <Button
              onClick={handleClose}
              className="cancel-button"
              variant="outlined"
            >
              Отменить
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </div>
  );
});

export default Calendar;
