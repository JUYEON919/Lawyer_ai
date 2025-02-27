package Lawyerai.Lawyer_ai.model;

public class LawQuestion {
    private String question;
    private String response;

    //생성자
    public LawQuestion(String question, String response) {
        this.question = question;
        this.response = response;
    }

    //Getter 와 Setter
    public String getQuestion() {
        return question;
    }
    public void setQuestion(String question) {
        this.question = question;
    }
    public String getResponse() {
        return response;
    }
    public void setResponse(String response) {
        this.response = response;
    }
}
